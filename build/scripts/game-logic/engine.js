define(["lib/socket.io-1.2.1","lib/events","lib/lodash","lib/clib","constants/AppConstants"],function(e,t,n,r,i){function s(){var r=this;n.extend(this,t),r.ws=e(i.Engine.HOST),r.isConnected=!1,r.username=null,r.balanceSatoshis=null,r.maxBet=i.Engine.MAX_BET,r.chat=[],r.tableHistory=[],r.joined=[],r.playerInfo=null,r.gameState=null,r.created=null,r.gameId=null,r.maxWin=null,r.startTime=null,r.placingBet=!1,r.cashingOut=!1,r.nextBetAmount=null,r.nextAutoCashout=null,r.tickTimer=null,r.lag=!1,r.ws.on("game_started",function(e){r.joined=[],r.gameState="IN_PROGRESS",r.startTime=Date.now(),r.lastGameTick=r.startTime,r.placingBet=!1,r.nextBetAmount=null,r.nextAutoCashout=null,Object.keys(e).forEach(function(t){r.username===t&&(r.balanceSatoshis-=e[t]),r.playerInfo[t]={bet:e[t]}}),r.trigger("game_started",r.playerInfo)}),r.ws.on("game_tick",function(e){r.lastGameTick=Date.now(),r.lag===!0&&(r.lag=!1,r.trigger("lag_change")),r.tickTimer&&clearTimeout(r.tickTimer),r.tickTimer=setTimeout(r.checkForLag.bind(r),i.Engine.STOP_PREDICTING_LAPSE)}),r.ws.on("error",function(e){console.log("on error: ",e),r.trigger("error",e)}),r.ws.on("err",function(e){console.error("Server sent us the error: ",e)}),r.ws.on("game_crash",function(e){r.tickTimer&&clearTimeout(r.tickTimer);for(var t in e.bonuses)console.assert(r.playerInfo[t]),r.playerInfo[t].bonus=e.bonuses[t],r.username===t&&(r.balanceSatoshis+=e.bonuses[t]);r.lastHash=e.hash;var n={created:r.created,ended:!0,game_crash:e.game_crash,game_id:r.gameId,hash:e.hash,player_info:r.playerInfo};r.tableHistory.length>=40&&r.tableHistory.pop(),r.tableHistory.unshift(n),r.gameState="ENDED",r.cashingOut=!1,r.lag=!1,r.trigger("game_crash",e)}),r.ws.on("game_starting",function(e){r.playerInfo={},r.joined=[],r.gameState="STARTING",r.gameId=e.game_id,r.startTime=new Date(Date.now()+e.time_till_start),r.maxWin=e.max_win,r.nextBetAmount&&r.doBet(r.nextBetAmount,r.nextAutoCashout,function(e){e&&console.log("Response from placing a bet: ",e)}),r.trigger("game_starting",e)}),r.ws.on("player_bet",function(e){r.username===e.username&&(r.placingBet=!1,r.nextBetAmount=null,r.nextAutoCashout=null),r.joined.splice(e.index,0,e.username),r.trigger("player_bet",e)}),r.ws.on("cashed_out",function(e){if(!r.playerInfo[e.username])return console.warn("Username not found in playerInfo at cashed_out: ",e.username);r.playerInfo[e.username].stopped_at=e.stopped_at,r.username===e.username&&(r.cashingOut=!1,r.balanceSatoshis+=r.playerInfo[e.username].bet*e.stopped_at/100),r.trigger("cashed_out",e)}),r.ws.on("msg",function(e){r.chat.length>i.Chat.MAX_LENGTH&&r.chat.splice(0,400),r.chat.push(e),r.trigger("msg",e)}),r.ws.on("update",function(){alert("Please refresh your browser! We just pushed a new update to the server!")}),r.ws.on("connect",function(){o(function(e,t){if(e&&e!=401){console.error("request ott error:",e),confirm("An error, click to reload the page: "+e)&&location.reload();return}r.ws.emit("join",{ott:t},function(e,t){if(e){console.error("Error when joining the game...",e);return}r.balanceSatoshis=t.balance_satoshis,r.chat=t.chat,r.username=t.username,r.isConnected=!0,r.gameState=t.state,r.playerInfo=t.player_info,r.gameId=t.game_id,r.maxWin=t.max_win,r.lastHash=t.last_hash,r.created=t.created,r.startTime=new Date(Date.now()-t.elapsed),r.joined=t.joined,r.tableHistory=t.table_history,r.gameState=="IN_PROGRESS"&&(r.lastGameTick=Date.now()),r.trigger("connected")})})}),r.ws.on("disconnect",function(e){r.isConnected=!1,console.log("Client disconnected |",e,"|",typeof e),r.trigger("disconnected")})}function o(e){try{var t=new XMLHttpRequest;if(!t)throw new Error("Your browser doesn't support xhr");t.open("POST","/ott",!0),t.setRequestHeader("Accept","text/plain"),t.send()}catch(n){console.error(n),alert("Requesting token error: "+n),location.reload()}t.onload=function(){if(t.status==200){var n=t.responseText;e(null,n)}else t.status==401?e(t.status):e(t.responseText)}}return s.prototype.checkForLag=function(){this.lag=!0,this.trigger("lag_change")},s.prototype.say=function(e){console.assert(e.length>1&&e.length<500),this.ws.emit("say",e)},s.prototype.bet=function(e,t,n){console.assert(typeof e=="number"),console.assert(r.isInteger(e)),console.assert(!t||typeof t=="number"&&t>=100);if(!r.isInteger(e)||e%100!=0)return console.error("The bet amount should be integer and divisible by 100");this.nextBetAmount=e,this.nextAutoCashout=t;if(this.gameState==="STARTING")return this.doBet(e,t,n);n&&n(null,"WILL_JOIN_NEXT"),this.trigger("bet_queued")},s.prototype.doBet=function(e,t,n){var r=this;r.placingBet=!0,this.ws.emit("place_bet",e,t,function(e){if(e){console.warn("place_bet error: ",e),e!=="GAME_IN_PROGRESS"&&e!=="ALREADY_PLACED_BET"&&alert("There was an error, please reload the window: "+e),n&&n(e);return}r.trigger("bet_placed"),n&&n(null)}),r.trigger("placing_bet")},s.prototype.cancelBet=function(){if(!this.nextBetAmount)return console.error("Can not cancel next bet, wasn't going to make it...");this.nextBetAmount=null,this.trigger("cancel_bet")},s.prototype.cashOut=function(e){var t=this;this.cashingOut=!0,this.ws.emit("cash_out",function(t){if(t){console.warn("Cashing out error: ",t);if(e)return e(t)}if(e)return e(null)}),this.trigger("cashing_out")},s.prototype.getGamePayout=function(){if(this.gameState!=="IN_PROGRESS")return null;if(Date.now()-this.lastGameTick<i.Engine.STOP_PREDICTING_LAPSE)var e=Date.now()-this.startTime;else var e=this.lastGameTick-this.startTime+i.Engine.STOP_PREDICTING_LAPSE;var t=r.growthFunc(e);return console.assert(isFinite(t)),t},new s});
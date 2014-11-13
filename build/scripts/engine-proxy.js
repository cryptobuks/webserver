define(["lib/events","lib/lodash"],function(e,t){var n=function(n,r){t.extend(this,e),this.engine=n,this.stopEngine=r};return n.prototype.localStop=function(){var e=this;this.events.forEach(function(t){var n=t[0],r=t[1];e.engine.off(n,r)})},n.prototype.getBalance=function(){return this.engine.balanceSatoshis},n.prototype.getMaxBet=function(){return this.engine.maxBet},n.prototype.getCurrentPayout=function(){return this.engine.getGamePayout()},n.prototype.getUsername=function(){return this.engine.username},n.prototype.lastGamePlay=function(){return this.lastGamePlayed()?this.engine.tableHistory[0].player_info[this.engine.username].stopped_at?"WON":"LOST":"NOT_PLAYED"},n.prototype.lastGamePlayed=function(){return!!this.engine.tableHistory[0].player_info[this.engine.username]},n.prototype.placeBet=function(e,t,n){this.engine.bet(e,t,n)},n.prototype.cashOut=function(e){this.engine.cashOut(e)},n.prototype.stop=function(){this.stopEngine()},n.prototype.chat=function(e){this.engine.say(e)},n});
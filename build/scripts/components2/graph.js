define(["lib/clib","lib/lodash"],function(e,t){function n(e,t){console.assert(e&&t),this.canvasWidth=e,this.canvasHeight=t,this.plotWidth=this.canvasWidth-30,this.plotHeight=this.canvasHeight-20,this.xStart=this.canvasWidth-this.plotWidth,this.yStart=this.canvasHeight-this.plotHeight,this.XAxisPlotMinValue=1e4,this.YAxisSizeMultiplier=2,this.YAxisInitialPlotValue="cero"}return n.prototype.resize=function(e){this.canvasWidth=e,this.plotWidth=this.canvasWidth-20,this.xStart=this.canvasWidth-this.plotWidth},n.prototype.setData=function(e,t,n){this.ctx=e,this.canvas=t,this.engine=n,this.gameState=n.gameState,this.userState=n.userState,this.cashingOut=n.cashingOut,this.lag=n.lag,this.startTime=n.startTime,this.gameState=="IN_PROGRESS"?(this.lastBalance=n.getGamePayout(),this.currentTime=n.getElapsedTime()):(this.lastBalance=0,this.currentTime=0)},n.prototype.calculatePlotValues=function(){this.YAxisPlotMinValue=this.YAxisSizeMultiplier,this.YAxisPlotValue=this.YAxisPlotMinValue,this.XAxisPlotValue=this.XAxisPlotMinValue,this.currentTime>this.XAxisPlotMinValue&&(this.XAxisPlotValue=this.currentTime),this.lastBalance>this.YAxisPlotMinValue&&(this.YAxisPlotValue=this.lastBalance),this.YAxisPlotValue-=1,this.widthIncrement=this.plotWidth/this.XAxisPlotValue,this.heightIncrement=this.plotHeight/this.YAxisPlotValue,this.currentX=this.currentTime*this.widthIncrement},n.prototype.clean=function(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)},n.prototype.drawGraph=function(){this.ctx.strokeStyle="Black",this.userState==="PLAYING"?(this.ctx.lineWidth=6,this.ctx.strokeStyle="#7cba00"):this.cashingOut?(this.ctx.lineWidth=6,this.ctx.strokeStyle="Grey"):this.ctx.lineWidth=4,this.ctx.beginPath(),e.seed(1);for(var t=0,n=0;t<=this.currentTime;t+=100,n++){var r=this.engine.calcGamePayout(t)-1,i=this.plotHeight-r*this.heightIncrement,s=t*this.widthIncrement;this.ctx.lineTo(s+this.xStart,i);if(n>5e3){console.log("For 1 too long!");break}}this.ctx.stroke()},n.prototype.drawAxes=function(){function e(e){console.assert(t.isFinite(e));var n=.4,r=.1;for(;;){if(e<n)return r;n*=5,r*=2;if(e<n)return r;n*=2,r*=5}}this.YAxisPlotMaxValue=this.YAxisPlotMinValue,this.payoutSeparation=e(this.lastBalance?this.lastBalance:1),this.ctx.lineWidth=1,this.ctx.strokeStyle="Black",this.ctx.font="10px Verdana",this.ctx.fillStyle="black";var n=this.plotHeight/this.YAxisPlotValue;for(var r=this.payoutSeparation,i=0;r<this.YAxisPlotValue;r+=this.payoutSeparation,i++){var s=this.plotHeight-r*n;this.ctx.fillText(r+1+"x",0,s),this.ctx.beginPath(),this.ctx.moveTo(this.xStart,s),this.ctx.lineTo(this.xStart+5,s),this.ctx.stroke();if(i>100){console.log("For 3 too long");break}}this.milisecondsSeparation=e(this.XAxisPlotValue),this.XAxisValuesSeparation=this.plotWidth/(this.XAxisPlotValue/this.milisecondsSeparation);for(var o=0,u=0,i=0;o<this.XAxisPlotValue;o+=this.milisecondsSeparation,u++,i++){var a=o/1e3,f=this.ctx.measureText(a).width,l=u*this.XAxisValuesSeparation+this.xStart;this.ctx.fillText(a,l-f/2,this.plotHeight+11);if(i>100){console.log("For 4 too long");break}}this.ctx.lineWidth=1,this.ctx.beginPath(),this.ctx.moveTo(this.xStart,0),this.ctx.lineTo(this.xStart,this.canvasHeight-this.yStart),this.ctx.lineTo(this.canvasWidth,this.canvasHeight-this.yStart),this.ctx.stroke()},n.prototype.drawGameData=function(){this.engine.gameState==="IN_PROGRESS"&&(this.userState==="PLAYING"?this.ctx.fillStyle="#7cba00":this.ctx.fillStyle="black",this.ctx.font="80px Verdana",this.ctx.fillText(parseFloat(this.lastBalance).toFixed(2)+"x",this.canvasWidth/4,150)),this.engine.gameState==="ENDED"&&this.engine.lastGameCrashedAt&&(this.canvasWidth>500?this.ctx.font="60px Verdana":this.ctx.font="40px Verdana",this.ctx.fillStyle="red",this.ctx.fillText("Game crashed",this.canvasWidth/5,100),this.ctx.fillText("@ "+e.formatSatoshis(this.engine.lastGameCrashedAt)+"x",this.canvasWidth/5,180))},n});
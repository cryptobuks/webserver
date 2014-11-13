define(["lib/seedrandom","lib/lodash"],function(e,t){function i(e,t){return typeof t=="undefined"&&(e%100===0?t=0:t=2),e.toFixed(t).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1,")}var n,r;return{formatSatoshis:function(e,t){return i(e/100,t)},formatDecimals:i,payout:function(e,t){return e*Math.pow(Math.E,6e-5*t)},payoutTime:function(e,t){return Math.log(t/e)/6e-5},seed:function(t){n=e(t),r=0},payoutNoise:function(e,t,r){var i=6e-5,s=1,o=1;switch(r){case 1:return e*Math.pow(Math.E,i*t)+Math.sin(t*s)*o;case 2:return e*Math.pow(Math.E,i*t)+Math.sin(Math.random()*s)*o;case 3:var u=n(),a=e*Math.pow(Math.E,i*t+u*s*o);return e*Math.pow(Math.E,i*t)+u*s*o}},parseBet:function(e){e=String(e);if(!/^\d+k*$/.test(e))return new Error("Bet may only contain digits, and k (to mean 1000)");var n=parseInt(e.replace(/k/g,"000"));return n<1?new Error("The bet should be at least 1 bit"):n>1e5?new Error("The bet must be less no more than 100,000 bits"):t.isNaN(n)||Math.floor(n)!==n?new Error("The bet should be an integer greater than or equal to one"):n},parseAutoCash:function(e){var n=e;return/^\d+(\.\d{1,2})?$/.test(n)?(n=parseFloat(n),console.assert(!t.isNaN(n)),n<1?new Error("The auto cash out amount should be bigger than 1"):n):new Error("Invalid auto cash out amount")},winProb:function(e,t){var n=Math.ceil(100*t/e);return 9900/(101*(n-1))},profit:function(e,t){var n=Math.ceil(100*t/e);return e*(n-100)/100},houseExpectedReturn:function(e,t){var n,r,i,s,o,u;return n=1/101,s=e,r=this.winProb(e,t),o=-0.01*e-this.profit(e,t),i=1-n-r,u=.99*e,n*s+r*o+i*u},camelCase:function(e){return e.toLowerCase().replace(/_(.)/g,function(e,t){return t.toUpperCase()})},capitaliseFirstLetter:function(e){return e.charAt(0).toUpperCase()+e.slice(1)},isInteger:function(e){return typeof e=="number"&&isFinite(e)&&e>-9007199254740992&&e<9007199254740992&&Math.floor(e)===e},isNumber:function(e){return typeof e=="number"&&isFinite(e)&&e>-9007199254740992&&e<9007199254740992},grammarBits:function(e){return e<=100?"bit":"bits"}}});
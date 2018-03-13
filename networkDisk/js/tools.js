//滚轮事件函数
function mousewheel(node,upFn,downFn){
	node.addEventListener('mousewheel',wheel)//谷歌 IE
	node.addEventListener('DOMMouseScroll',wheel)//FireFox	

	function wheel(ev){
		var d = true;  // 标示为true为向上

		if(ev.wheelDelta){
			d = ev.wheelDelta > 0 ? true : false;
		}else if(ev.detail){
			d = ev.detail < 0 ? true : false;
		}

		if(d){
			typeof upFn === 'function' && upFn.call(this,ev);
		}else{
			typeof downFn === 'function' && downFn.call(this,ev);;
			//if(typeof downFn === 'function')  downFn();
		}
	}
}



//封装判断是否碰撞的函数
function ElementsCrash(box1,box2){
	if(box1.getBoundingClientRect().right < box2.getBoundingClientRect().left ||
		box1.getBoundingClientRect().left > box2.getBoundingClientRect().right ||
		box1.getBoundingClientRect().bottom < box2.getBoundingClientRect().top ||
		box1.getBoundingClientRect().top > box2.getBoundingClientRect().bottom
	){//没有碰上
		return false;

	}else{//碰上了
		return true;
	}
}
//抖函数
function shake(el,attr,speek,callback){
	if(el.shake) return;
	var arr = [];  // [30,-30,25,-25,20,-20,....0]
	for( var i = speek; i >=0; i-=3){
		arr.push(i,-i)
	}
	arr.push(0);
	var n = 0;
	el.shake = setInterval(function (){

		var start = parseInt(css(el,attr))
		el.style[attr] = start + arr[n] + 'px'	

		n++;

		if(n >= arr.length){
			clearInterval(el.shake);
			el.shake = null;
			if(typeof callback === 'function'){
				callback();
			}
		}

	},30)	
}
function css(element,attr,value){
	if(typeof value === 'undefined'){
		return getComputedStyle(element)[attr]
	}else{
		element.style[attr] = value;
	}
}

function animate(el,attrObj,d,fx,callback){
	if(el.timer) return;


	var beginObj = {}; // 每一个样式的起始值都放在这里
	var countObj = {}; // 每一个样式的总距离放这里

	// 循环对象
	for(var miaov in attrObj){
		beginObj[miaov] = parseFloat(css(el,miaov))
		countObj[miaov] = attrObj[miaov] - beginObj[miaov];
	}
	var beginTime = Date.now();  // 获取时间戳（毫秒）
	el.timer = setInterval(function (){
		var t = Date.now() - beginTime; // 已过去多少时间

		if(t > d){
			t = d;
			clearInterval(el.timer)
			el.timer = null;
		}

		// 要多个属性运动 {left,top}
		for(var attr in attrObj){
			if(attr === 'opacity'){
				el.style[attr] = Tween[fx](t,beginObj[attr],countObj[attr],d);
			}else{
				el.style[attr] = Tween[fx](t,beginObj[attr],countObj[attr],d) + 'px'
			}
		}

		// 运动结束
		if(t === d){
			if(typeof callback === 'function'){
				callback();
			}
			
		}
		
	})
}

var Tween = {
				linear: function (t, b, c, d){  //匀速
					return c*t/d + b;
				},
				easeIn: function(t, b, c, d){  //加速曲线
					return c*(t/=d)*t + b;
				},
				easeOut: function(t, b, c, d){  //减速曲线
					return -c *(t/=d)*(t-2) + b;
				},
				easeBoth: function(t, b, c, d){  //加速减速曲线
					if ((t/=d/2) < 1) {
						return c/2*t*t + b;
					}
					return -c/2 * ((--t)*(t-2) - 1) + b;
				},
				easeInStrong: function(t, b, c, d){  //加加速曲线
					return c*(t/=d)*t*t*t + b;
				},
				easeOutStrong: function(t, b, c, d){  //减减速曲线
					return -c * ((t=t/d-1)*t*t*t - 1) + b;
				},
				easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
					if ((t/=d/2) < 1) {
						return c/2*t*t*t*t + b;
					}
					return -c/2 * ((t-=2)*t*t*t - 2) + b;
				},
				elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
					if (t === 0) { 
						return b; 
					}
					if ( (t /= d) == 1 ) {
						return b+c; 
					}
					if (!p) {
						p=d*0.3; 
					}
					if (!a || a < Math.abs(c)) {
						a = c; 
						var s = p/4;
					} else {
						var s = p/(2*Math.PI) * Math.asin (c/a);
					}
					return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
				},
				elasticOut: function(t, b, c, d, a, p){    //*正弦增强曲线（弹动渐出）
					if (t === 0) {
						return b;
					}
					if ( (t /= d) == 1 ) {
						return b+c;
					}
					if (!p) {
						p=d*0.3;
					}
					if (!a || a < Math.abs(c)) {
						a = c;
						var s = p / 4;
					} else {
						var s = p/(2*Math.PI) * Math.asin (c/a);
					}
					return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
				},    
				elasticBoth: function(t, b, c, d, a, p){
					if (t === 0) {
						return b;
					}
					if ( (t /= d/2) == 2 ) {
						return b+c;
					}
					if (!p) {
						p = d*(0.3*1.5);
					}
					if ( !a || a < Math.abs(c) ) {
						a = c; 
						var s = p/4;
					}
					else {
						var s = p/(2*Math.PI) * Math.asin (c/a);
					}
					if (t < 1) {
						return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
								Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
					}
					return a*Math.pow(2,-10*(t-=1)) * 
							Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
				},
				backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
					if (typeof s == 'undefined') {
					   s = 1.70158;
					}
					return c*(t/=d)*t*((s+1)*t - s) + b;
				},
				backOut: function(t, b, c, d, s){
					if (typeof s == 'undefined') {
						s = 3.70158;  //回缩的距离
					}
					return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
				}, 
				backBoth: function(t, b, c, d, s){
					if (typeof s == 'undefined') {
						s = 1.70158; 
					}
					if ((t /= d/2 ) < 1) {
						return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
					}
					return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
				},
				bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
					return c - Tween['bounceOut'](d-t, 0, c, d) + b;
				},       
				bounceOut: function(t, b, c, d){//*
					if ((t/=d) < (1/2.75)) {
						return c*(7.5625*t*t) + b;
					} else if (t < (2/2.75)) {
						return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
					} else if (t < (2.5/2.75)) {
						return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
					}
					return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
				},      
				bounceBoth: function(t, b, c, d){
					if (t < d/2) {
						return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
					}
					return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
				}
			}
// 背景类
function Background(){
	this.w = 320;
	this.h = 568;
	this.img = oArr[0]; //传入背景图
	this.y = 0 ;
	this.speed = 2;//bg移动速度
}
Background.prototype = {
	draw:function(){
		if(this.y>canvas.height){
			this.y = 0;
		}		
		context.drawImage(this.img,0,0,this.w,this.h,0,this.y,canvas.width,canvas.height);
		context.drawImage(this.img,0,0,this.w,this.h,0,this.y-canvas.height,canvas.width,canvas.height);
		this.y+=this.speed;
	}
}

//飞机类
function Fly(){
	this.w = 66;
	this.h = 82;
	this.useImg = oArr[12];
	// this.context = context;
	this.imgArr = [oArr[12],oArr[13]]
	this.imgIndex = 0 ;
	this.y = canvas.height*0.8;
	this.x = canvas.width*0.5-this.w*0.5;
	// this.bol = true;
	this.speed = 10;
}
Fly.prototype = {
	draw:function(){	
		if(flyNum%this.speed==0){
			this.bol = !this.bol;
			this.imgIndex= this.imgIndex ? 0 : 1;
		}
		this.useImg = this.imgArr[this.imgIndex]
		context.drawImage(this.useImg,this.x,this.y); 
		flyNum++;
	},
	touchstart:function(){
		var _this = this;
		//飞机移动
		function flyMove(e){
			var e = e||window.event;
			var touchs = e.touches[0]
			_this.x = touchs.clientX-_this.differX
			_this.y = touchs.clientY-_this.differY
			// Fly.draw();
			return false;
		}

		canvas.addEventListener("touchstart",function(e){
			var e = e||window.event;
			var touchs = e.touches[0]
			 _this.differX = touchs.clientX-_this.x;
			 _this.differY = touchs.clientY-_this.y;
			 canvas.addEventListener("touchmove",flyMove,false);
			 // return false;
		},false)

		document.addEventListener("touchend",function(){
			canvas.removeEventListener("touchmove",flyMove,false);
		},false) 
	}
}

function Bullet(){
	this.w = 6;
	this.h = 14;
	this.speed = 5;
	this.img = oArr[1];
	this.delayIndex = 0;
	this.delay = 15;
	this.objArr = [];
}
Bullet.prototype = {
	draw:function(fly){
		this.delayIndex++;
				
		if(this.delayIndex>=this.delay){
			var obj = {
				x:fly.x+fly.w*0.5-this.w*0.5,
				y:fly.y-this.h,
				displayBol:false,
			}
			this.objArr.push(obj);
			this.delayIndex = 0 ;

		}
		for(var i = 0;i<this.objArr.length;i++){
			this.objArr[i].y-=this.speed;
			//超出屏幕删除数组内的该对象
			if(this.objArr[i].y+this.w<0||this.objArr[i].displayBol){
				this.objArr.splice(i,1);
				continue;
			}
			context.drawImage(this.img,this.objArr[i].x,this.objArr[i].y)
		}		
	}
}
//-------敌机----------
function Enemy(){
	this.w = 32;
	this.h = 24;
	// this.speed = 5;
	this.img = [oArr[7],oArr[2],oArr[3],oArr[4],oArr[5],oArr[6]];
	this.delayIndex = 0;
	this.delay = 40;
	this.fightIndex = 0;
	this.fight = 3;
	this.objArr = [];
	this.hp = 1;
}
Enemy.prototype = {
	draw:function(bullet){
		this.delayIndex++;
		this.fightIndex++;
		if(this.delayIndex>=this.delay){
			//随机位置和速度
			var rSpeed = Math.random()*(4-2+1)+2 
			var positionX = Math.random()*(canvas.width-this.w+1)
			var obj = {
				x:positionX,
				y:0,
				speed:rSpeed,
				imgIndex:0,
				hp:2,
				dieBol:false,
			}
			this.objArr.push(obj);
			this.delayIndex = 0 ;
		}
		//-----是否被子弹击中-------
		if(this.fightIndex>=this.fight){
			for(var i = 0;i<this.objArr.length;i++){
				for(var n = 0;n<bullet.objArr.length;n++){
					// console.log(100)
					//绘制敌机路径
					context.beginPath();
					context.rect(this.objArr[i].x,this.objArr[i].y,this.w,this.h);
					context.closePath();

					if(context.isPointInPath(bullet.objArr[n].x,bullet.objArr[n].y)){
						bullet.objArr[n].displayBol = true;
						this.objArr[i].hp--;
						if(this.objArr[i].hp == 0){
							this.objArr[i].dieBol = true;
						}
						n = bullet.objArr.length;
						i=this.objArr.length
						break;
					}
				}
			}
			this.fightIndex = 0;
		}

		for(var i = 0;i<this.objArr.length;i++){
			this.objArr[i].y+=this.objArr[i].speed;	

			//超出屏幕删除数组内的该对象
			if(this.objArr[i].y>canvas.height){
				this.objArr.splice(i,1);
				i--;
				continue;
			}
			if(this.objArr[i].dieBol){
				this.objArr[i].imgIndex++;
				if(this.objArr[i].imgIndex==this.img.length-1){
					this.objArr.splice(i,1);
					i--;
					continue;					
				}
			}
			context.drawImage(this.img[this.objArr[i].imgIndex],this.objArr[i].x,this.objArr[i].y)
		}		
	}
}
//---------------敌机--------------
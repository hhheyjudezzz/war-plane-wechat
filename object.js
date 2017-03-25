// 背景类
function Background(){
	this.w = 320;
	this.h = 568;
	this.img = oArr[0];//背景图的对象
	this.y = 0;//y坐标
	this.speed = 2;//速度
}
Background.prototype = {
	// 绘制背景图片
	draw:function(){
		if(this.y >= canvas.height){
			this.y = 0;
		}

		// 绘制(drawImage 5参数：img,画布x,画布y,画布w,画布h)
		// drawImage 9参数: img,原图x,原图y,原图裁剪w,原图裁剪h,画布x,画布y,画布w,画布h
		context.drawImage(this.img, 0, 0, this.w,this.h, 0, this.y, canvas.width, canvas.height);
		context.drawImage(this.img, 0, 0, this.w,this.h, 0, this.y - canvas.height, canvas.width, canvas.height);

		// 改变y值
		this.y += this.speed;
	}
}

// 飞机类：玩家的飞机
function Hero(){
	// 原图的宽高
	this.w = 66;
	this.h = 82;
	// 飞机的坐标
	this.x = canvas.width*0.5 - this.w/2;
	this.y = canvas.height*0.8;
	// 图片对象(数组)：有两张
	this.imgs = [oArr[1],oArr[2]];
	// 图片的下标
	this.imgsIndex = 0;
	// 延迟(切换两个图)
	this.delay = 5;
	// 延迟下标
	this.delayIndex = 0;
}

Hero.prototype = {
	// 绘制飞机
	draw:function(){
		this.delayIndex++;
		if(this.delayIndex > this.delay){
			// 互相切换两张图片
			this.imgsIndex = this.imgsIndex ? 0 : 1;
			// 恢复delayIndex为0
			this.delayIndex = 0;
		}

		// 三个参数（img,画布x,画布y,画布w,画布h）
		context.drawImage(this.imgs[this.imgsIndex],this.x,this.y);
	}
};


// 子弹类
function Bullet(){
	// 宽高
	this.w = 6;
	this.h = 14;
	// 图片对象
	this.img = oArr[7];
	// 子弹移动的速度
	this.speed = 5;
	// 延迟
	this.delay = 18;
	this.delayIndex = 0;
	// 数组来保存canvas有多少颗子弹
	this.objArr = [];
}

Bullet.prototype = {
	// 绘制子弹
	draw:function(hero){//----------------
		// 累加延迟下标
		this.delayIndex++;
		// 判断是否要发射新子弹
		if(this.delayIndex > this.delay){
			// 创建一个子弹的信息
			var obj = {
				x:hero.x + hero.w/2 - this.w/2,
				y:hero.y - this.h
			};
			// 把子弹的信息存入到数组里面
			this.objArr.push(obj);

			// 恢复delayIndex为0
			this.delayIndex = 0;
		}

		// 遍历子弹数组，把所有子弹都画到canvas上
		for(var i = 0; i < this.objArr.length; i++){
			// 改变子弹的y的值
			this.objArr[i].y -= this.speed;

			// 判断子弹是否超出屏幕
			if(this.objArr[i].y < -this.h){//--------------------------
				// 在数组里面删除
				this.objArr.splice(i,1);

				// 直接跳到下一个循环
				continue;
			}

			// 绘制子弹到canvas上
			context.drawImage(this.img, this.objArr[i].x, this.objArr[i].y);
		}
	}
};

//-----敌机-----------
function Enemy(){
	this.w = 34;
	this.h = 24;
	//延迟时间
	this.delay = 30 ;
	this.delayIndex = 0;
	//敌机图片对象
	this.imgs = [oArr[8],oArr[9],oArr[10],oArr[11]];
	this.objArr = [];
}
Enemy.prototype = {
	draw:function(){
		this.delayIndex++;
		//判断是否需要出现新的敌机
		if(this.delayIndex>this.delay){
			var _speed = parseInt(Math.random()*(4-2+1)+2);
			var _x = Math.random()*(canvas.width-this.w)
			var obj = {
				//敌机数据
				x:_x,
				y:-this.h,
				speed:_speed,
				//敌机生命值
				hp:2,
				dieBol:false,
				//图片切换的下标
				imgsIndex:0,
			}
			this.objArr.push(obj);
			this.delayIndex = 0 ;
		}
		//遍历绘制敌机 
		for(var i = 0;i< this.objArr.length;i++){
			//改变敌机的y值
			this.objArr[i].y+=this.objArr[i].speed;
			//判断生命值 是否死亡
			if(this.objArr[i].hp<=0){
				this.objArr[i].dieBol = true;
			}
			//判断是否超出屏幕
			if(this.objArr[i].y>canvas.height){
				//删除对应数组里的对象
				this.objArr[i].splice(i,1);
				//回退i
				i--;
				//直接进行下一次循环
				continue;
			}
			context.drawImage(this.imgs[this.objArr[i].imgsIndex],this.objArr[i].x,this.objArr[i].y)
		}
	}
}
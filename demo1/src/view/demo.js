//游戏主场景
var mainLayer = cc.Layer.extend({
    __cnt:null,
    bg1:null,
    score:null,
    plane:null,
    enemy:null,
    _bullet:null,
    adjustmentBG:null,
    size:null,
    bigPlan:null,
    smallPlan:null,
    mediumPlan:null,
    spriteFrameCache:null,
    enemyArr:[],
    isBigBullet:null,
    isChangeBullet:null,
    bulletSpeed:null,
    bulletTiming:null,
    isGameOver:null,
    ctor:function(){
        this._super();
        size = cc.winSize;
        adjustmentBG = 0;
        spriteFrameCache = cc.spriteFrameCache;
        this.initData();
        this.getUI();
        this.madeBullet();
        this.resetBullet();
        this.scheduleUpdate();
        // 添加屏幕触摸事件
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.touchbegan.bind(this),
            onTouchMoved: this.touchmoved.bind(this),
            onTouchEnded: this.touchended.bind(this)
        }, this);
        return true;
    },
    initData:function(){
        __cnt = 1;
        score = 0;
        bigPlan = 0;
        smallPlan = 0;
        mediumPlan = 0;
        isBigBullet = false;
        isChangeBullet = false;
        bulletSpeed = 0;
        bulletTiming = 0;
        isGameOver = false;
        enemyArr = [];
    },
    //加载资源
    getUI:function(){
        spriteFrameCache.addSpriteFrames(res.gameArts_plist, res.gameArts_png);
        //加载背景
        var bgName = "background_2.png";
        this.bg1 = new cc.Sprite(spriteFrameCache.getSpriteFrame(bgName));
        var sX = size.width/this.bg1.width;
        var sY = size.height/this.bg1.height;
        this.bg1.scaleX = sX;
        this.bg1.scaleY = sY;
        this.bg1.setAnchorPoint(0.5,0);
        this.bg1.setPosition(size.width / 2,adjustmentBG);
        this.addChild(this.bg1, 0);
        this.bg2 = new cc.Sprite(spriteFrameCache.getSpriteFrame(bgName));
        this.bg2.scaleX = sX;
        this.bg2.scaleY = sY;
        this.bg2.setAnchorPoint(0.5,0)
        this.bg2.setPosition(size.width / 2,size.height+adjustmentBG);
        this.addChild(this.bg2, 0);

        //加载积分榜
        this.scoreLabel = new cc.LabelTTF("0000", "MarkerFelt-Thin", 38);
        this.scoreLabel.setColor(cc.color(0,0,0));
        this.scoreLabel.setAnchorPoint(cc.p(0,1));
        this.scoreLabel.setPosition(cc.p(10, size.height-10));
        this.addChild(this.scoreLabel,4);
        //加载友军飞机
        this.plane = new heroPlane();
        this.plane.setPosition(size.width/2,this.plane.height);
        this.addChild(this.plane,3);
    },
    touchbegan:function (touch, event) {
        //cc.log("onTouchBegan");
        return true;
    },
    touchmoved:function (touch, event) {
        //cc.log("onTouchMoved");
        var touchLocation = this.convertTouchToNodeSpace(touch);
        var oldTouchLocation = touch.getPreviousLocationInView();
        oldTouchLocation = cc.director.convertToGL(oldTouchLocation);
        oldTouchLocation = this.convertToNodeSpace(oldTouchLocation);
        var translation = cc.pSub(touchLocation,oldTouchLocation);
        this.panForTranslation(translation);
        return true;
    },
    touchended:function (touch, event) {
        //cc.log("touchended");
        return true;
    },
    panForTranslation:function(translation){
        if(isGameOver) return;
        this.plane.setPosition(this.boundLayerPos(translation));
    },
    boundLayerPos:function(newPos){
        var retval = newPos;
        retval.x = this.plane.getPositionX()+newPos.x;
        retval.y = this.plane.getPositionY()+newPos.y;
        if (retval.x>=size.width) {
            retval.x = size.width;
        }else if (retval.x<=33) {
            retval.x = 33;
        }

        if (retval.y >=this.plane.height) {
            retval.y = this.plane.height;
        }else if (retval.y <= 43) {
            retval.y = 43;
        }
        //cc.log("retval.x = "+retval.x,"retval.y = "+retval.y);
        return retval;
    },
    //移动飞机
    moveFoePlane:function(){
        for(var i=0;i<this.enemyArr.length;i++){
            var foePlane = this.enemyArr[i];
            foePlane.setPosition(cc.p(foePlane.getPositionX(),foePlane.getPositionY()-foePlane.speed));
            if(foePlane.y<-foePlane.height){
                foePlane.stopAllActions();
                this.enemyArr.splice(i,1)
                foePlane.removeFromParent();
            }
        }

    },
    update:function (dt) {
        if(isGameOver) return;
        this.backgrouneScroll();
        this.firingBullets();
        this.addFoePlane();
        this.moveFoePlane();
        this.collisionDetection();
        this.bulletTimingFn();
    },
    //背景滚动
    backgrouneScroll:function(){
        adjustmentBG--;
        if(adjustmentBG<=0)adjustmentBG = size.height;;
        this.bg1.setPosition(size.width / 2, adjustmentBG);
        this.bg2.setPosition(size.width / 2, adjustmentBG-size.height+2);
    },
    //添加飞机
    addFoePlane:function(){
        bigPlan++;
        smallPlan++;
        mediumPlan++;
        if (bigPlan>500) {
            var foePlane = this.makeBigFoePlane();
            this.addChild(foePlane,3);
            foePlane.scaleX = foePlane.scaleY = 1.3;
            this.enemyArr.push(foePlane);
            bigPlan = 0;
        }

        if (mediumPlan>400) {
            var foePlane = this.makeMediumFoePlane();
            this.addChild(foePlane,3);
            foePlane.scaleX = foePlane.scaleY = 1.3;
            this.enemyArr.push(foePlane);
            mediumPlan = 0;
        }

        if (smallPlan>45) {
            var foePlane = this.makeSmallFoePlane();
            this.addChild(foePlane,3);
            foePlane.scaleX = foePlane.scaleY = 1.3;
            this.enemyArr.push(foePlane);
            smallPlan = 0;
        }
    },
    //造大飞机
    makeBigFoePlane:function () {
        var bigFoePlane = "enemy2_fly_1.png";
        var bigFoePlaneActionArray = [];
        //大飞机敌机动画
        var bigFoePlane = new enemy(bigFoePlane);
        bigFoePlane.setPosition(cc.p(Math.random()*size.width,size.height));
        for(var i = 1;i<=2;i++){
            var frame = cc.spriteFrameCache.getSpriteFrame("enemy2_fly_"+i+".png");
            bigFoePlaneActionArray.push(frame);
        }
        var runAHelper = new RunActionHelper();
        var animate = runAHelper.createAnimationByPlist(bigFoePlaneActionArray, 0.1);
        bigFoePlane.setData(2,10,Math.random()*1+1,++__cnt);
        bigFoePlane.runAction(animate.repeatForever());
        return bigFoePlane;
    },
    //造中飞机
    makeMediumFoePlane:function () {
        var mediumFoePlane = new enemy("enemy3_fly_1.png");
        mediumFoePlane.setPosition(cc.p(Math.random()*size.width,size.height));
        mediumFoePlane.setData(3,5,Math.random()*1+2,++__cnt);
        return mediumFoePlane;
    },
    //造小飞机
    makeSmallFoePlane:function () {
        var smallFoePlane = new enemy("enemy1_fly_1.png");
        smallFoePlane.setPosition(cc.p(Math.random()*size.width,size.height));
        smallFoePlane.setData(1,1,Math.random()*2+2,++__cnt);
        return smallFoePlane;
    },
    //发射子弹
    firingBullets:function(){
        this._bullet.setPosition(cc.p(this._bullet.getPositionX(),this._bullet.getPositionY()+bulletSpeed));
        if (this._bullet.getPositionY()>size.height-20) {
            //[self resetBullet];
            this.resetBullet();
        }
    },
    // 子弹还原
    resetBullet:function(){
        if ((isBigBullet&&isChangeBullet)||(!isBigBullet&&isChangeBullet)) {
            this._bullet.removeFromParent();
            this.madeBullet();
            isChangeBullet = false;
        }

        bulletSpeed = (460-(this.plane.getPositionY() + 50))/15;
        if (bulletSpeed<5)
        {
            bulletSpeed=5;
        }
        this._bullet.setPosition(cc.p(this.plane.getPositionX(),this.plane.getPositionY()+50));
    },
    //制造子弹
    madeBullet:function () {
        this._bullet = new cc.Sprite(spriteFrameCache.getSpriteFrame((!isBigBullet)?"bullet1.png":"bullet2.png"));
        this._bullet.setAnchorPoint(cc.p(0.5,0.5));
        this.addChild(this._bullet);
        this._bullet.scaleX = this._bullet.scaleY = 1.3;
    },
    //子弹时间
    bulletTimingFn:function () {
        if (isBigBullet) {
            if (bulletTiming>0) {
                bulletTiming--;
            }else {
                isBigBullet = false;
                isChangeBullet = true;
                bulletTiming = 900;
            }
        }
    },
    //碰撞检测
    collisionDetection:function () {
        // 子弹跟敌机
        var bulletRec = this._bullet.getBoundingBox();
        for(var i=0;i<this.enemyArr.length;i++){
            var foePlane = this.enemyArr[i];
            var foePlaneRec = foePlane.getBoundingBox();
            //cc.log("foePlaneRec.x = "+foePlaneRec.x,"foePlaneRec.y = "+foePlaneRec.y,"foePlaneRec.width = "+foePlaneRec.width,"foePlaneRec.height = "+foePlaneRec.height);
            if(cc.rectIntersectsRect(bulletRec,foePlaneRec)){
                //cc.log("碰撞了！");
                this.resetBullet();
                foePlane.hp -= (isBigBullet?2:1);
                this.fowPlaneHitAnimation(foePlane);
                if(foePlane.hp<=0){
                    this.fowPlaneBlowupAnimation(foePlane);
                    this.enemyArr.splice(i,1)
                }
            }
        }
        //飞机跟打飞机
        var planeRec = this.plane.getBoundingBox();
        for(i=0;i<this.enemyArr.length;i++){
            var foePlane = this.enemyArr[i];
            var foePlaneRec = foePlane.getBoundingBox();
            if(cc.rectIntersectsRect(planeRec,foePlaneRec)){
                this.playerBlowupAnimation();
                this.fowPlaneBlowupAnimation(foePlane);// 同归于尽
                this.enemyArr.splice(i,1);
            }
        }
    },
    //添加打击效果
    fowPlaneHitAnimation:function (foePlane) {
        if (foePlane.planeType == 3) {
            if (foePlane.hp <= 5) {
                var arr = [];
                for (var i = 1; i <= 2; i++) {
                    var frame = cc.spriteFrameCache.getSpriteFrame("enemy3_hit_" + i + ".png");
                    arr.push(frame);
                }
                var runAHelper = new RunActionHelper();
                var animate = runAHelper.createAnimationByPlist(arr, 0.1);
                foePlane.stopAllActions();
                foePlane.runAction(animate.repeatForever());
            }
        } else if (foePlane.planeType == 2) {
            if (foePlane.hp <= 3) {
                var arr2 = [];
                for (var i = 1; i <= 1; i++) {
                    var frame = cc.spriteFrameCache.getSpriteFrame("enemy2_hit_" + i + ".png");
                    arr2.push(frame);
                }
                var runAHelper = new RunActionHelper();
                var animate = runAHelper.createAnimationByPlist(arr2, 0.1);
                foePlane.stopAllActions();
                foePlane.runAction(animate.repeatForever());
            }
        }
    },
    //爆炸特效
    fowPlaneBlowupAnimation:function (foePlane) {
        var forSum = 0;
        if (foePlane.planeType == 3) {
            forSum = 4;
            score+=6000;
        }else if (foePlane.planeType  == 2) {
            score+=30000;
            forSum = 7;
        }else if (foePlane.planeType  == 1) {
            forSum = 4;
            score+=1000;
        }
        this.scoreLabel.setString(score.toString());
        foePlane.stopAllActions();
        var arr = [];
        for (var i = 1; i<=forSum ; i++ ) {
            var frame = cc.spriteFrameCache.getSpriteFrame("enemy"+foePlane.planeType+"_blowup_" + i + ".png");
            arr.push(frame)
        }
        foePlane.removeAllChildren();
        var runAHelper = new RunActionHelper();
        var animate = runAHelper.createAnimationByPlist(arr, 0.1);
        foePlane.runAction(cc.sequence(animate,cc.callFunc(this.blowupEnd,this,foePlane)));
    },
    blowupEnd:function (foePlane) {
        if(foePlane == this.plane){
            this.gameOver();
        }
        foePlane.removeFromParent();
    },
    //主角飞机爆炸
    playerBlowupAnimation:function () {
        var arr = [];
        for (var i = 1; i<=4 ; i++ ) {
            var frame = cc.spriteFrameCache.getSpriteFrame("hero_blowup_" + i + ".png");
            arr.push(frame)
        }
        var runAHelper = new RunActionHelper();
        var animate = runAHelper.createAnimationByPlist(arr, 0.1);
        this.plane.runAction(cc.sequence(animate,cc.callFunc(this.blowupEnd,this,this.plane)));
    },
    //游戏结束
    gameOver:function () {
        isGameOver = true;
        for(i=0;i<this.enemyArr.length;i++){
            var foePlane = this.enemyArr[i];
            foePlane.stopAllActions();
        }
        this.plane.stopAllActions();
        var gameOverLabel = new cc.LabelTTF("飞机大战分类", "MarkerFelt", 35);
        gameOverLabel.setPosition(cc.p(size.width/2, size.height/2+300));
        this.addChild(gameOverLabel,4);
        var scoreLabel = new cc.LabelTTF(score.toString(), "MarkerFelt", 25);
        scoreLabel.setPosition(cc.p(size.width/2, size.height/2+250));
        this.addChild(scoreLabel,4);
        var gameOverItem = new cc.MenuItemFont("重玩",this.restartFn,this);
        gameOverItem.setFontName("MarkerFelt-Thin");
        gameOverItem.setFontSize(30);
        var restart = new cc.Menu(gameOverItem);
        restart.setPosition(cc.p(size.width/2, size.height/2+200));
        this.addChild(restart,4);
    },
    //重置
    restartFn:function () {
        this.removeAllChildren();
        if(this.enemyArr!=null) this.enemyArr.splice(0,this.enemyArr.length);
        this.initData();
        this.getUI();
        this.madeBullet();
        this.resetBullet();
    }
});
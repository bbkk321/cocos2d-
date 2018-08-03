var MainController = MainView.extend({
    __cnt:null,
    bg1:null,
    score:null,
    plane:null,
    enemy:null,
    _bullet:null,
    bulletArr:[],
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
    bulletTime:null,
    bomb:null,
    bombNum:null,
    bombCount:null,
    bombRewardScore:null,
    bulletRewardScore:null,
    bullet:null,
    bulletCount:null,
    isGameOver:null,
    isPause:false,
    isStart:false,
    ctor:function () {
        this._super();
        size = cc.winSize;
        adjustmentBG = 0;
        spriteFrameCache = cc.spriteFrameCache;
        return true;
    },
    initData:function(){
        __cnt = 1;
        score = 0;
        bigPlan = 0;
        smallPlan = 0;
        mediumPlan = 0;
        isBigBullet = false;
        this.isChangeBullet = false;
        bulletSpeed = 10;
        bulletTiming = 0;
        this.bulletTime = 0;
        isGameOver = false;
        isPause = false;
        isStart = false;
        enemyArr = [];
        this.bomb = null;
        this.bombNum = 1;
        this.bombCount = 1;
        this.bullet = null;
        this.bulletCount = 1;
        this.bombRewardScore = 100000;
        this.bulletRewardScore = 80000;
    },
    addEvent:function () {
        this._super();
        cc.loader.load(res_json.startLayer_json,function () {
            var layer = new StartLayer();
            this.addChild(layer,100);
        }.bind(this));
        this.BTN_PASUE.addClickEventListener(this.onPasue.bind(this));
        this.BTN_BOMB.addClickEventListener(this.onBomb.bind(this));
        Global.getSingle().getCustomEvent(COUSTOM_EVNET.START,this.startEvent.bind(this));
        Global.getSingle().getCustomEvent(COUSTOM_EVNET.AGAIN,this.againEvent.bind(this));
        Global.getSingle().getCustomEvent(COUSTOM_EVNET.PAUSE,this.pauseEvent.bind(this));
        Global.getSingle().getCustomEvent(COUSTOM_EVNET.GAMEOVER,this.gameoverEvent.bind(this));
        // 添加屏幕触摸事件
        if('mouse' in cc.sys.capabilities) {
            //cc.log("capabilities--mouse");
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                swallowTouches: true,
                onMouseDown:this.mouseDown.bind(this),
                onMouseMove: this.mouseMove.bind(this),
                onMouseUp: this.mouseUp.bind(this)
            },this);
        }else if('touches' in cc.sys.capabilities){
            //cc.log("capabilities--touches");
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (event){
                    //cc.log("onTouchBegan");
                    return true;
                }.bind(this),//this.touchbegan.bind(this),
                //onMouseMove: this.touchmoved.bind(this),
                //onMouseUp: this.touchended.bind(this)
            },this);
        }
        this.initData();
        this.scheduleUpdate();
    },
    startEvent:function(){
        this.Panel_UI.setVisible(true);
        this.getHero();
        isStart = true;
        isGameOver = false;
    },
    onPasue:function() {
        isPause = true;
        cc.loader.load(res_json.pauseLayer_json,function () {
            var layer = new PauseLayer();
            this.addChild(layer,100);
        }.bind(this));
    },
    onBomb:function() {
        if(this.bombNum==0) return;
        this.bombNum--;
        this.BOMB_TXT.string = "x"+this.bombNum.toString();
        for(var i=this.enemyArr.length-1;i>=0;i--){
            var foePlane = this.enemyArr[i];
            this.fowPlaneBlowupAnimation(foePlane);
            this.enemyArr.splice(i,1);
        }
    },
    againEvent:function() {
        this.restartFn();
        isGameOver = false;
        this.getHero();
        isStart = true;
    },
    pauseEvent:function() {
        isPause = false;
    },
    gameoverEvent:function() {
        cc.loader.load(res_json.startLayer_json,function () {
            var layer = new StartLayer();
            this.addChild(layer,100);
        }.bind(this));
        this.initData();
        this.SCORE_TXT.setString("0000");
    },
    update:function (dt) {
        this.backgrouneScroll();
        if(isGameOver||isPause||!isStart) return;
        this.firingBullets();
        this.addFoePlane();
        this.moveFoePlane();
        this.collisionDetection();
        this.reward();
    },
    //初始化主角
    getHero:function(){
        //加载友军飞机
        this.plane = new heroPlane();
        this.plane.setPosition(size.width/2,this.plane.height);
        this.Panel_CONTENT.addChild(this.plane,3);
    },
    isClick:false,
    mouseDown:function (event) {
        //cc.log("mouseDown");
        if(!isStart) return;
        isClick = true;
        var pos = event.getLocation();
        var planePos = cc.p(this.plane.getPositionX(),this.plane.getPositionY());
        this.mouseDowRadian = Math.atan2((planePos.y-pos.y), (planePos.x-pos.x));
        this.mouseDownDis = Math.sqrt((pos.x-planePos.x)*(pos.x-planePos.x)+(pos.y-planePos.y)*(pos.y-planePos.y));
        return true;
    },
    mouseMove:function (event) {
        //cc.log("mouseMove");
        if(!isStart) return;
        if(!isClick) return false;
        if(isPause) return false;
        var pos = event.getLocation();
        this.panForTranslation(pos);
        return true;
    },
    mouseUp:function (event) {
        //cc.log("mouseUp");
        if(!isStart) return;
        isClick = false;
        return true;
    },
    panForTranslation:function(translation){
        if(isGameOver) return;
        this.plane.setPosition(this.boundLayerPos(translation));
    },
    boundLayerPos:function(newPos){
        var retval = newPos;
        var radian = this.mouseDowRadian;
        var xMargin = Math.cos(radian) * this.mouseDownDis;
        var yMargin = Math.sin(radian) * this.mouseDownDis;
        var p = cc.p(retval.x + xMargin,retval.y + yMargin);
        retval.x = p.x;
        retval.y = p.y;
        if (retval.x>=size.width - this.plane.width) {
            retval.x = size.width - this.plane.width;
        }else if (retval.x<=this.plane.width) {
            retval.x = this.plane.width;
        }
        if(retval.y>size.height-this.plane.height){
            retval.y = size.height-this.plane.height;
        }else if(retval.y<=this.plane.height){
            retval.y = this.plane.height;
        }
        return retval;
    },
    //移动飞机
    moveFoePlane:function(){
        for(var i=0;i<this.enemyArr.length;i++){
            var foePlane = this.enemyArr[i];
            foePlane.setPosition(cc.p(foePlane.getPositionX(),foePlane.getPositionY()-foePlane.speed));
            if(foePlane.y<-foePlane.height){
                foePlane.stopAllActions();
                this.enemyArr.splice(i,1);
                foePlane.removeFromParent();
            }
        }

    },
    //背景滚动
    backgrouneScroll:function(){
        adjustmentBG--;
        if(adjustmentBG<=0)adjustmentBG = size.height;
        this.IMG_BG1.setPosition(0, adjustmentBG);
        this.IMG_BG2.setPosition(0, adjustmentBG-size.height+2);
    },
    //添加飞机
    addFoePlane:function(){
        bigPlan++;
        smallPlan++;
        mediumPlan++;
        if (bigPlan>500) {
            var foePlane = this.makeBigFoePlane();
            this.Panel_CONTENT.addChild(foePlane,3);
            foePlane.scaleX = foePlane.scaleY = Global.getSingle().GLOBAL_SCALE;
            this.enemyArr.push(foePlane);
            bigPlan = 0;
        }

        if (mediumPlan>400) {
            var foePlane = this.makeMediumFoePlane();
            this.Panel_CONTENT.addChild(foePlane,3);
            foePlane.scaleX = foePlane.scaleY = Global.getSingle().GLOBAL_SCALE;
            this.enemyArr.push(foePlane);
            mediumPlan = 0;
        }

        if (smallPlan>45) {
            var foePlane = this.makeSmallFoePlane();
            this.Panel_CONTENT.addChild(foePlane,3);
            foePlane.scaleX = foePlane.scaleY = Global.getSingle().GLOBAL_SCALE;
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
    //造炸弹奖励
    makeBombReward:function() {
      var bomb = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("enemy4_fly_1.png"));
      bomb.setPosition(cc.p(Math.random()*size.width,size.height));
      bomb.setScale(Global.getSingle().GLOBAL_SCALE);
      return bomb;
    },
    //造子弹奖励
    makeBulletReward:function() {
      var bullet = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("enemy5_fly_1.png"));
      bullet.setPosition(cc.p(Math.random()*size.width,size.height));
      bullet.setScale(Global.getSingle().GLOBAL_SCALE);
      return bullet;
    },
    //发射子弹
    firingBullets:function(){
        for(var j=0;j<this.bulletArr.length;j++){
            this.bulletArr[j].setPosition(cc.p(this.bulletArr[j].getPositionX(),this.bulletArr[j].getPositionY()+bulletSpeed));
        }
        this.bulletTime++;
        if(this.bulletTime > 15){
            this.bulletTime = 0;
            this.madeBullet();
        }
        for(var i=this.bulletArr.length-1;i>0;i--){
            if(this.bulletArr[i].getPositionY()>size.height-20){
                this.resetBullet(i);
            }
        }
    },
    // 子弹还原
    resetBullet:function(index){
        if(!index) return;
        var bullet = this.bulletArr[index];
        this.Panel_CONTENT.removeChild(bullet);
        this.bulletArr.splice(index,1);
        //isChangeBullet = false;
    },
    //制造子弹
    madeBullet:function () {
        if(this.isChangeBullet){
            var bullet1 = new Bullet((!isBigBullet)?"bullet1.png":"bullet2.png");
            this.Panel_CONTENT.addChild(bullet1);
            bullet1.setScale(Global.getSingle().GLOBAL_SCALE);
            bullet1.setPosition(cc.p(this.plane.getPositionX()-40,this.plane.getPositionY()+50));
            this.bulletArr.push(bullet1);

            var bullet2 = new Bullet((!isBigBullet)?"bullet1.png":"bullet2.png");
            this.Panel_CONTENT.addChild(bullet2);
            bullet2.setScale(Global.getSingle().GLOBAL_SCALE);
            bullet2.setPosition(cc.p(this.plane.getPositionX()+40,this.plane.getPositionY()+50));
            this.bulletArr.push(bullet2);
        }else{
            var bullet = new Bullet((!isBigBullet)?"bullet1.png":"bullet2.png");
            this.Panel_CONTENT.addChild(bullet);
            bullet.setScale(Global.getSingle().GLOBAL_SCALE);
            bullet.setPosition(cc.p(this.plane.getPositionX(),this.plane.getPositionY()+50));
            this.bulletArr.push(bullet);
        }
    },
    //碰撞检测
    collisionDetection:function () {
        // 子弹跟敌机
        for(var j=0;j<this.bulletArr.length;j++){
            var bulletRec = this.bulletArr[j].getBoundingBox();
            for(var i=0;i<this.enemyArr.length;i++){
                var foePlane = this.enemyArr[i];
                var foePlaneRec = foePlane.getBoundingBox();
                if(cc.rectIntersectsRect(bulletRec,foePlaneRec)){
                    //cc.log("碰撞了！");
                    this.resetBullet(j);
                    foePlane.hp -= (isBigBullet?2:1);
                    this.fowPlaneHitAnimation(foePlane);
                    if(foePlane.hp<=0){
                        this.fowPlaneBlowupAnimation(foePlane);
                        this.enemyArr.splice(i,1);
                    }
                }
            }
        }
        //主角跟敌机
        var planeRec = this.plane.getBoundingBox();
        for(var k=0;k<this.enemyArr.length;k++){
            var foePlane = this.enemyArr[k];
            var foePlaneRec = foePlane.getBoundingBox();
            if(cc.rectIntersectsRect(planeRec,foePlaneRec)){
                this.playerBlowupAnimation();
            }
        }
        //主角跟炸弹奖励
        if(this.bomb){
            var bombRec = this.bomb.getBoundingBox();
            if(cc.rectIntersectsRect(planeRec,bombRec)){
                this.bomb.removeFromParent();
                this.bomb = null;
                this.bombNum++;
                this.BOMB_TXT.string = "x"+this.bombNum.toString();
            }
        }
        //主角跟子弹奖励
        if(this.bullet&&!this.isChangeBullet){
            var bulletRec = this.bullet.getBoundingBox();
            if(cc.rectIntersectsRect(planeRec,bulletRec)){
                this.bullet.removeFromParent();
                this.bullet = null;
                this.isChangeBullet = true;
                bulletSpeed*=2;

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
                foePlane.runAction(animate);
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
                foePlane.runAction(animate);
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
        this.SCORE_TXT.setString(score.toString());
        foePlane.stopAllActions();
        var arr = [];
        for (var i = 1; i<=forSum ; i++ ) {
            var frame = cc.spriteFrameCache.getSpriteFrame("enemy"+foePlane.planeType+"_blowup_" + i + ".png");
            arr.push(frame);
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
            arr.push(frame);
        }
        var runAHelper = new RunActionHelper();
        var animate = runAHelper.createAnimationByPlist(arr, 0.1);
        this.plane.runAction(cc.sequence(animate,cc.callFunc(this.blowupEnd,this,this.plane)));
    },
    reward:function() {
        if(score>=this.bombRewardScore*this.bombCount){
            if(this.bomb==null){
                this.bomb = this.makeBombReward();
                this.Panel_CONTENT.addChild(this.bomb,3);
                this.bombCount++;
            }
        }
        if(score>=this.bulletRewardScore*this.bulletCount&&!this.isChangeBullet){
            if(this.bullet==null){
                this.bullet = this.makeBulletReward();
                this.Panel_CONTENT.addChild(this.bullet,3);
                this.bulletCount++;
            }
        }
        if(this.bomb){
            this.bomb.setPosition(cc.p(this.bomb.getPositionX(),this.bomb.getPositionY()-8));
            if(this.bomb.y<=-this.bomb.height) {
                this.bomb.removeFromParent();
                this.bomb = null;
            }
        }
        if(this.bullet){
            this.bullet.setPosition(cc.p(this.bullet.getPositionX(),this.bullet.getPositionY()-8));
            if(this.bullet.y<=-this.bullet.height) {
                this.bullet.removeFromParent();
                this.bullet = null;
            }
        }
    },
    //游戏结束
    gameOver:function () {
        isGameOver = true;
        for(var i=this.enemyArr.length-1;i>=0;i--){
            var foePlane = this.enemyArr[i];
            foePlane.stopAllActions();
            foePlane.removeFromParent();
            this.enemyArr.splice(i,1);
        }
        for(i=this.bulletArr.length-1;i>=0;i--){
            this.resetBullet(i);
        }
        this.plane.stopAllActions();
        cc.loader.load(res_json.gameoverLayer_json,function () {
            var layer = new GameOverLayer(score);
            this.addChild(layer,100);
        }.bind(this));
        this.Panel_UI.setVisible(false);
        this.BOMB_TXT.setString("x1");
    },
    //重置
    restartFn:function () {
        isGameOver = true;
        for(var i=this.enemyArr.length-1;i>=0;i--){
            var foePlane = this.enemyArr[i];
            foePlane.stopAllActions();
            foePlane.removeFromParent();
            this.enemyArr.splice(i,1);
        }
        for(i=this.bulletArr.length-1;i>=0;i--){
            this.resetBullet(i);
        }
        this.Panel_CONTENT.removeChild(this.plane);
        this.initData();
        this.SCORE_TXT.setString("0000");
        this.BOMB_TXT.setString("x1");
    }
});
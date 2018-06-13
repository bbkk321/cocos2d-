//主角色类
var heroPlane = cc.Sprite.extend({
    sp:null,
    ctor:function () {
        this._super();
        var planeName = "hero_fly_1.png";
        var playerActionArray = [];
        //友军飞机动画
        for(var i = 1;i<=2;i++){
            var frame = cc.spriteFrameCache.getSpriteFrame("hero_fly_"+i+".png");
            playerActionArray.push(frame);
        }
        var runAHelper = new RunActionHelper();
        var animate = runAHelper.createAnimationByPlist(playerActionArray, 0.1);
        sp = new cc.Sprite(spriteFrameCache.getSpriteFrame(planeName));
        sp.setAnchorPoint(cc.p(0,0));
        this.width = sp.width;
        this.height = sp.height;
        this.scaleX = this.scaleY = 1.3;
        this.runAction(animate.repeatForever());
    },
});
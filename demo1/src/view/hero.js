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
        var animation = cc.Animation.create(playerActionArray, 0.1);
        var animate = cc.animate(animation);
        sp = new cc.Sprite(spriteFrameCache.getSpriteFrame(planeName));
        sp.setAnchorPoint(cc.p(0,0));
        this.width = sp.width;
        this.height = sp.height;
        this.scaleX = this.scaleY = Global.getSingle().GLOBAL_SCALE;
        this.runAction(animate.repeatForever());
        return true;
    },
    playAni:function (num,url,callback) {
        var arr = [];
        for(var i = 1;i<=num;i++){
            var frame = cc.spriteFrameCache.getSpriteFrame(url+i+".png");
            arr.push(frame);
        }
        var animation = cc.Animation.create(arr, 0.1);
        var animate = cc.animate(animation);
        this.runAction(cc.sequence(animate,cc.callFunc(callback,this)));
    }
});
//子弹类
var Bullet = cc.Sprite.extend({
    sp:null,
    ctor:function (url) {
        this._super();
        this.sp = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(url));
        this.sp.setAnchorPoint(cc.p(0.5,0.5));
        this.addChild(this.sp);
    }
});
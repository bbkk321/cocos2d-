//子弹类
var Bullet = cc.Sprite.extend({
    sp:null,
    ctor:function (url) {
        this._super();
        this.init(url);
        return true;
    },
    init:function(url) {
        this.sp = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(url));
        this.sp.setAnchorPoint(cc.p(0.5,0.5));
        this.addChild(this.sp);
    },
    unuse: function () {
        this.retain();//if in jsb
        this.setVisible(false);
        this.removeFromParent(true);
    },
    reuse: function (url) {
        //this.init(url);
        this.setVisible(true);
    },
});

Bullet.Create = function (url) {
    if (cc.pool.hasObject(Bullet)) return cc.pool.getFromPool(Bullet, url);
    return  new Bullet(url);
}
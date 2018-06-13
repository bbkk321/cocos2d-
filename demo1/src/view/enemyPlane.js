敌机类
var enemy = cc.Sprite.extend({
    sp:null,
    //敌机种类
    planeType:null,
    //血量
    hp:null,
    //速度
    speed:null,
    //敌机id
    __id:null,
    ctor:function(url){
        this._super();
        sp = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(url));
        sp.setAnchorPoint(cc.p(0,0));
        this.addChild(sp);
        this.width = sp.width;
        this.height = sp.height;
        planeType = 0;
        hp = 0;
        speed = 0;
        __id = 0;
    },

    shot:function(){

    },



});
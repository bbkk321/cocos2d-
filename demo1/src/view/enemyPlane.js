//敌机类
var Enemy = cc.Sprite.extend({
    sp:null,
    //敌机种类
    planeType:0,
    //血量
    hp:0,
    //速度
    speed:0,
    ctor:function(url,_planeType,_hp,_speed){
        this._super();
        this.initData(url,_planeType, _hp, _speed);
        return true;
    },

    initData:function(url,_planeType,_hp,_speed) {
        this.sp = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(url));
        this.sp.setAnchorPoint(cc.p(0,0));
        this.addChild(this.sp);
        this.width = this.sp.width;
        this.height = this.sp.height;
        this.setScale(Global.getSingle().GLOBAL_SCALE);
        this.planeType = _planeType;
        this.hp = _hp;
        this.speed = _speed;
    },
    unuse: function () {
        this.retain();//if in jsb
        //this.setVisible(false);
        this.planeType = 0;
        this.hp = 0;
        this.speed = 0;
        //this.sp.stopAllActions();
        //this.sp.removeAllChildren();
        this.sp.removeFromParent();
        //this.removeChild(this.sp);
        //this.sp = null;
        this.removeFromParent();
    },
    reuse: function (url, _planeType, _hp, _speed) {
        //this.setVisible(true);
        this.initData(url,_planeType, _hp, _speed);
    },
    playAni:function (num,url,type,callback) {
        var arr = [];
        for(var i = 1;i<=num;i++){
            var frame = cc.spriteFrameCache.getSpriteFrame(url+i+".png");
            arr.push(frame);
        }
        var animation = cc.Animation.create(arr, 0.1);
        var animate = cc.animate(animation);
        switch (type) {
            case 0:
                this.sp.runAction(animate);
                break;
            case 1:
                this.sp.runAction(animate.repeatForever());
                break;
            case 2:
                this.sp.runAction(cc.sequence(animate,cc.callFunc(callback,this)));
            default:
                break;
        }
    }
});
Enemy.Create = function (url, _planeType, _hp, _speed) {
    if (cc.pool.hasObject(Enemy)) return cc.pool.getFromPool(Enemy, url, _planeType, _hp, _speed);
    return  new Enemy(url, _planeType ,_hp , _speed);
}

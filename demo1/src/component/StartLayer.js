var StartLayer = ViewBaseLayer.extend({
    layerJson:res_json.startLayer_json,
    resouceNode:[],
    ctor:function () {
        this._super();
        return true;
    },
    initView:function () {
        this._super();
        this.BTN_START = this.resouceNode["BTN_START"];
        this.SP_LOAD = this.resouceNode["SP_LOAD"];
        var actionArr = [];
        for(var i = 1;i<=3;i++){
            var frame = cc.spriteFrameCache.getSpriteFrame("loading"+i+".png");
            actionArr.push(frame);
        }
        var runAHelper = new RunActionHelper();
        var animate = runAHelper.createAnimationByPlist(actionArr, 0.3);
        this.SP_LOAD.runAction(animate.repeatForever());
    },
    addEvent:function () {
        this._super();
        this.BTN_START.addClickEventListener(this.onStart.bind(this));
    },
    onStart:function () {
        Global.getSingle().setCustomEvent(COUSTOM_EVNET.START);
        this.removeFromParent();
    }
});
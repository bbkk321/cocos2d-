var PauseLayer = ViewBaseLayer.extend({
    layerJson:res_json.pauseLayer_json,
    resouceNode:[],
    ctor:function () {
        this._super();
        return true;
    },
    initView:function () {
        this._super();
        this.BTN_AGAIN = this.resouceNode["BTN_AGAIN"];
        this.BTN_CONTINUE = this.resouceNode["BTN_CONTINUE"];
    },
    addEvent:function () {
        this._super();
        this.BTN_AGAIN.addClickEventListener(this.onAgain.bind(this));
        this.BTN_CONTINUE.addClickEventListener(this.onContinue.bind(this));
    },
    onAgain:function () {
        Global.getSingle().setCustomEvent(COUSTOM_EVNET.AGAIN);
        this.removeFromParent();
    },
    onContinue:function () {
        Global.getSingle().setCustomEvent(COUSTOM_EVNET.PAUSE);
        this.removeFromParent();
    }
});
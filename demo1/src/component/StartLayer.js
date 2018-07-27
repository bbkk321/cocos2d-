var StartLayer = ViewBaseLayer.extend({
    layerJson:res_json.startLayer_json,
    resouceNode:[],
    ctor:function () {
        this._super();
        return true;
    },
    initView:function () {
        this.BTN_START = this.resouceNode["BTN_START"];
    },
    addEvent:function () {
        this.BTN_START.addClickEventListener(this.onStart.bind(this))
    },
    onStart:function () {
        Global.getSingle().setCustomEvent(COUSTOM_EVNET.START);
        this.removeFromParent();
    }
});
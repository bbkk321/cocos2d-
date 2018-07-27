var MainView = ViewBaseLayer.extend({
    layerJson:res_json.planeScene_json,
    resouceNode:[],
    ctor:function () {
        this._super();
        return true;
    },
    initView:function () {
        this._super();
        this.Panel_CONTENT = this.resouceNode["Panel_CONTENT"];
        this.IMG_BG1 = this.resouceNode["IMG_BG1"];
        this.IMG_BG2 = this.resouceNode["IMG_BG2"];
        this.BTN_PASUE = this.resouceNode["BTN_PASUE"];
        this.SCORE_TXT = this.resouceNode["SCORE_TXT"];
        this.BTN_BOMB = this.resouceNode["BTN_BOMB"];
        this.BOMB_TXT = this.resouceNode["BOMB_TXT"];
        this.Panel_UI = this.resouceNode["Panel_UI"];
        this.Panel_UI.setVisible(false);
    }
});
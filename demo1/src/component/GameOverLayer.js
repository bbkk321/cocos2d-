var GameOverLayer = ViewBaseLayer.extend({
    layerJson:res_json.gameoverLayer_json,
    resouceNode:[],
    score:null,
    ctor:function (score) {
        this._super();
        this.score = score;
        return true;
    },
    initView:function () {
        this._super();
        this.HIGHTEST_TXT = this.resouceNode["HIGHTEST_TXT"];
        this.CURRENT_TXT = this.resouceNode["CURRENT_TXT"];
        this.BTN_GAMEOVER = this.resouceNode["BTN_GAMEOVER"];
        this.CURRENT_TXT.string = this.score;
        /*if(Global.getSingle().getScore(DATA.STORAGE)==null){
            Global.getSingle().saveScore(DATA.STORAGE,this.score);
        }else{
            var tempScore = Global.getSingle().getScore(DATA.STORAGE);
            if(tempScore>this.score) this.score = tempScore;
            Global.getSingle().saveScore(DATA.STORAGE,this.score);
        }*/
        var tempScore = Global.getSingle().getScore(DATA.STORAGE);
        cc.log("tempScore = "+tempScore);
        if(tempScore==null) Global.getSingle().saveScore(DATA.STORAGE,this.score);
        else if(tempScore>this.score) this.score = tempScore;
        this.HIGHTEST_TXT.string = this.score;
    },
    addEvent:function () {
        this._super();
        this.BTN_GAMEOVER.addClickEventListener(this.onGameover.bind(this));
    },
    onGameover:function () {
        Global.getSingle().setCustomEvent(COUSTOM_EVNET.GAMEOVER);
        this.removeFromParent();
    }
});
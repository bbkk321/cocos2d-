//全局类
(function(global){
    global.Global = {
        GLOBAL_SCALE:2,//全局缩放系数
        SCORE:"score",//存储分数键值
        LISTENER:null,
        saveScore:function (key,value) {
            cc.sys.localStorage.setItem(key,value);
        },
        getScore:function (key) {
            return cc.sys.localStorage.getItem(key);
        },
        setCustomEvent(key,data){
            var event = new cc.EventCustom(key);
            event.setUserData(data);
            cc.eventManager.dispatchEvent(event);
        },
        getCustomEvent(key,callback){
            this.LISTENER = cc.EventListener.create({
                event: cc.EventListener.CUSTOM,
                eventName: key,
                callback: callback
            });
            cc.eventManager.addListener(this.LISTENER,1);
        },
        clearCustomEvent(){
            if(this.LISTENER!=null){
                cc.eventManager.removeListener(this.LISTENER);
                this.LISTENER = null;
            }
        }
    };
    global.Global.getSingle = function(){
        return this;
    }
})(window);
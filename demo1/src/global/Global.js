//全局类
(function(global){
    global.Global = {
        GLOBAL_SCALE:2,//全局缩放系数
        SCORE:"score",//存储分数键值
        saveScore:function (key,value) {
            cc.sys.localStorage.setItem(key,value);
        },
        getScore:function (key) {
            return cc.sys.localStorage.getItem(key);
        }
    };
    global.Global.getSingle = function(){
        return this;
    }
})(window);
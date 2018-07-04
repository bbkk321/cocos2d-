(function (global) {
    global.AssetManager = {
        //添加图集资源
        addSpriteFramesGameArts:function(){
            cc.spriteFrameCache.addSpriteFrames(res.gameArts_plist, res.gameArts_png);
        },
    };
    global.AssetManager.getSingle = function () {
        return this;
    }
})(window);
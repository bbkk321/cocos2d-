var RunActionHelper = function(){

};
RunActionHelper.prototype.createAnimationByPlist = function(frames, time){
    var animation = cc.Animation.create(frames, time);
    var animate = cc.animate(animation);
    return animate;
};
RunActionHelper.prototype.createAnimationByImg = function(imgAry, time){
    var animation = cc.Animation.create();
    for(var i=0; i<imgAry.length; i++){
        animation.addSpriteFrameWithFile(imgAry[i]);
    }
    animation.setDelayPerUnit(time || 0.1);//每一帧播放间隔
    animation.setRestoreOriginalFrame(true);//是否回到第一帧播放
    var animate = cc.animate(animation);
    return animate;
};
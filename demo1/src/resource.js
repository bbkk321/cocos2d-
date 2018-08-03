var res = {
    gameArts_plist:"res/gameArts.plist",
    gameArts_png:"res/gameArts.png",
    gameArts_hd_plist:"res/gameArts-hd.plist",
    gameArts_hd_png:"res/gameArts-hd.png",
};
var res_json = {
    startLayer_json:"res/StartLayer.json",
    pauseLayer_json:"res/PauseLayer.json",
    gameoverLayer_json:"res/GameOverLayer.json",
    planeScene_json:"res/PlaneScene.json"
};

var g_resources = [
    {
        type:"font",
        name:"Marker Felt",
        srcs:["res/font/MarkerFelt.ttf"]
    }
];
for (var i in res) {
    g_resources.push(res[i]);
}
for(var j in res_json){
    g_resources.push(res_json[j]);
}

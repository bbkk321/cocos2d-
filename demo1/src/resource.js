var res = {
    HelloWorld_png : "res/HelloWorld.png",
    gameArts_plist:"res/gameArts.plist",
    gameArts_png:"res/gameArts.png",
    gameArts_hd_plist:"res/gameArts-hd.plist",
    gameArts_hd_png:"res/gameArts-hd.png"
    //bg_png:"background_2.png",
    //plane_png:"hero_fly_1.png",
    //enemy_png:"enemy1_fly_1.png",
    //bullet_png:"bullet1.png",
};

var g_resources = [
    res.gameArts_plist,
    res.gameArts_png,
    res.gameArts_hd_plist,
    res.gameArts_hd_png,
    {
        type:"font",
        name:"Marker Felt",
        srcs:["res/font/MarkerFelt.ttf"]
    }
];
for (var i in res) {
    g_resources.push(res[i]);
}

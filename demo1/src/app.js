
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        //var helloLabel = new cc.LabelTTF("微信飞机大战", "Marker Felt", 38);
        //helloLabel.setColor(cc.color(0,0,0));
        // position the label on the center of the screen
        //helloLabel.x = size.width / 2;
        //helloLabel.y = size.height - helloLabel.height;
        // add the label as a child to this layer
        //this.addChild(helloLabel, 5);

        // add "HelloWorld" splash screen"
        //var demo = new mainLayer();
        //this.addChild(demo,0);

        var mainscene = new MainScene();
        cc.loader.load(res_json.planeScene_json,function () {
            var main = new MainController();
            mainscene.addChild(main);
            cc.director.runScene(mainscene);
        });
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});
var MainScene = cc.Scene.extend({
    ctor:function(){
        this._super();
        return true;
    },
    onEnter:function () {
        this._super();
    },
    onEnterTransitionDidFinish:function(){
        this._super();
    }
});


var ViewBaseLayer = cc.Layer.extend({
    sprite:null,
    layerJson:null,
    widget:null,
    ctor:function(){
        this._super();
        if(this.layerJson==null){
            cc.log("this.layerJson is null!");
            return;
        }
        var json = ccs.load(this.layerJson);
        var widget = json.node;
        this.addChild(widget,1);
        this.widget = widget;
        return true;
    },
    add:function () {

    },

    exit:function (node,isPause,submit,cancel) {
        if(isPause==true){
            node.pause();
        }
        var exit_str = Translate.instance().getValue("EXIT_STR_TIP");
        var layer = FunctionsManager.getInstance().showDialog(this,exit_str,function(){
            node.resume();
            if(submit){
                submit();
            }
        }.bind(this),function(){
            node.resume();
            if(cancel){
                cancel();
            }
        }.bind(this));
    },

    onEnterTransitionDidFinish:function () {
        this._super();
        cc.sys.garbageCollect();
        this.initAllNode(this.widget);
        //添加备案信息
        this.addRecordweb();
        this.initView();
        this.addEvent();
    },
     
    onEnter:function(){
        this._super();
    },
    

    onExit:function(){
        this._super();
        //释放资源
        this.cleanAllNode(this);
        cc.loader.release(this.layerJson);
    },

    cleanAllNode:function (node) {
        var children = node.getChildren();
        var parentName = node.getName();
        var childrenCount = node.getChildrenCount();
        if(childrenCount<1){
            return;
        }
        for (var i = 0;i<childrenCount;i++){
            var curNode = children[childrenCount-i-1];
            var curName = curNode.getName();
            var subChildCount = curNode.getChildrenCount();
            if(subChildCount>0){
                this.cleanAllNode(curNode);
            }else{
                if(this.resouceNode[curName]){
                    this.resouceNode[curName].removeFromParent(true);
                    this.resouceNode[curName] = null;
                }
            }
        }
    },
    

    initView:function(){

    },

    addEvent:function(){
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function(keyCode,event){
            if(keyCode == cc.KEY.back){
                cc.log("back");
                var className = "org/cocos2dx/javascript/AppActivity";
                var funcName = "exit";
                var sigs = "()V";
                jsb.reflection.callStaticMethod(className,funcName,sigs);
            }
            else if(keyCode == cc.KEY.menu){
                cc.log("menu");
            }}},this);
    },

    initAllNode:function(node){
        var children = node.getChildren();
        var parentName = node.getName();
        var childrenCount = node.getChildrenCount();
        // cc.log(parentName);
        if(childrenCount<1){
            return;
        }
        for (var i = 0;i<childrenCount;i++){
            var curNode = children[i];
            var curName = curNode.getName();
            var subChildCount = curNode.getChildrenCount();
            this.resouceNode[curName] = curNode;
            if(subChildCount>0){
                this.initAllNode(curNode);
            }else{

            }
        }
    },

    //添加备案信息
    addRecordweb:function () {
        var str1 = "© Copyright 2012 广州大思教育科技发展有限公司. All Rights Reserved. ICP备案证书号:";
        var str2 = "粤ICP备06021163号";
        var str3 = "________________";
        // cc.log(this.layerJson);
        var jsonArr=["IndexScene.json","CourseScene.json","MainScene.json","HallScene.json","LearnScene.json","PictureBookLayer.json","MonthRankList.json"];
        var isShow = false;
        for(var o in jsonArr){
            var obj = jsonArr[o];
            if(this.layerJson.indexOf(obj)>-1){
                isShow = true;
                break;
            }
        }
        if(isShow){
            var s = cc.director.getWinSize();
            var l1 = new cc.LabelTTF(str1,"Thonburi", 16);
            l1.setColor(cc.color(0,0,0));
            this.widget.addChild(l1,100);
            l1.x = s.width /2-100;
            l1.y = 10;

            var l2 = new ccui.Text();
            l2.string = str2;
            l2.setColor(cc.color(0,128,0));
            this.widget.addChild(l2,100);
            l2.x = s.width /2+300;
            l2.y = 10;
            l2.setTouchEnabled(true);
            l2.addClickEventListener(function () {
                var url = "http://www.miitbeian.gov.cn";
                cc.sys.openURL(url);
            });

            var l3 = new ccui.Text();
            l3.string = str3;
            l3.setColor(cc.color(0,0,0));
            this.widget.addChild(l3,100);
            l3.x = s.width /2+300;
            l3.y = 10;

        }
    },



});

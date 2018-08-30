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
});

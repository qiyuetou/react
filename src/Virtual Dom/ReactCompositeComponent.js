/**
 * Created by daifei on 2018/12/11
 * 复合组件类型 类
 */

function ReactCompositeComponent(element){
    // 存放元素element对象
    this._currentElement = element;
    // 存放唯一标识
    this._rootNodeID = null;
    // 存放对应的ReactClass的实例
    this._instance = null;
}


ReactCompositeComponent.prototype.receiveComponent = function(){

};


/**
 * 初始化当前组件 render markup  并注册事件监听
 * @param rootID
 * @return {
    children: []
    html: null
    node: div.root
    text: null
    toString: ƒ toString()
    }
 */
ReactCompositeComponent.prototype.mountComponent = function(rootID){
    this._rootNodeID = rootID;
    const publicProps = this._currentElement.props;
    const ReactClass = this._currentElement.type;

    const inst = new ReactClass(publicProps);

    this._instance = inst;
    //保留对当前 component的引用
    inst._reactInternalInstance = this;

    if(inst.componentWillMount){
        inst.componentWillMount();
    }
}

export default ReactCompositeComponent;

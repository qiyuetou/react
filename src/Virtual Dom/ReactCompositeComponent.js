import {instantiateReactComponent} from './ReactMount';
import {ReactElement} from './element';
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

var ReactNodeTypes = {
    HOST: 0,
    COMPOSITE: 1,
    EMPTY: 2,

    getType: function (node) {
        if (node === null || node === false) {
            return ReactNodeTypes.EMPTY;
        } else if (ReactElement.isValidElement(node)) {
            if (typeof node.type === 'function') {
                return ReactNodeTypes.COMPOSITE;
            } else {
                return ReactNodeTypes.HOST;
            }
        }
    }
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
ReactCompositeComponent.prototype.mountComponent = function(renderedElement){

    var nodeType = ReactNodeTypes.getType(renderedElement);
    this._renderedNodeType = nodeType;
    //=========这里执行  instantiateReactComponent方法去判断是那个类型组件------
    //在这里就形成了循环
    var child = instantiateReactComponent(renderedElement, nodeType !== ReactNodeTypes.EMPTY);
    console.log('---child',child);
    this._renderedComponent = child;
    child.mountComponent();

    //var markup = ReactReconciler.mountComponent(child, transaction, hostParent, hostContainerInfo, this._processChildContext(context), selfDebugID);
    // 初始化挂载
    //var markup = this.performInitialMount(renderedElement, nativeParent, nativeContainerInfo, transaction, context);
}

export default ReactCompositeComponent;

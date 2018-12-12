import {ReactElement} from './element';
import ReactCompositeComponent from './ReactCompositeComponent';
import ReactDomComponent from './ReactDomComponent';


var topLevelRootCounter = 1;
var TopLevelWrapper = function () {
    this.rootID = topLevelRootCounter++;
};
TopLevelWrapper.prototype.isReactComponent = {};

TopLevelWrapper.prototype.render = function () {
    return this.props;
};

//比较两个createElement 返回是否需要更新
function shouldUpdateReactComponent(prevElement, nextElement) {
    var prevEmpty = prevElement === null || prevElement === false;
    var nextEmpty = nextElement === null || nextElement === false;
    if (prevEmpty || nextEmpty) {
        return prevEmpty === nextEmpty;
    }

    var prevType = typeof prevElement;
    var nextType = typeof nextElement;
    if (prevType === 'string' || prevType === 'number') {
        return nextType === 'string' || nextType === 'number';
    } else {
        return nextType === 'object' && prevElement.type === nextElement.type && prevElement.key === nextElement.key;
    }
}
const ReactMount = {
    render: function (nextElement, container, callback) {
        return ReactMount._renderSubtreeIntoContainer(nextElement,container,callback);
    },
    _renderSubtreeIntoContainer(nextElement, container, callback){
        // 包装ReactElement，将nextElement挂载到wrapper的props属性下，这段代码不是很关键
        var nextWrappedElement = ReactElement(TopLevelWrapper, null, null, null, null, null, nextElement);
        // 初始化，渲染组件，然后插入到DOM中。_renderNewRootComponent很关键，后面详细分析
        var component = ReactMount._renderNewRootComponent(nextWrappedElement, container);
        // render方法中带入的回调，ReactDOM.render()调用时一般不传入
        if (callback) {
            callback.call(component);
        }

        return component;
    },
    _renderNewRootComponent : function(nextElement,container){
        var componentInstance = instantiateReactComponent(nextElement);

        //事务的形式调用mountComponentIntoNode
        var markup = componentInstance.mountComponent()

        ReactMount._mountImageIntoNode(markup, container);
        console.log('----markup',markup)
    },
    _mountImageIntoNode : function(markup, container,instance){
        container.innerHTML = markup;
        console.log('---container',markup);
        markup._hostNode = container.firstChild;

    },
    mountComponentIntoNode : function(){
        // 调用对应ReactComponent中的mountComponent方法来渲染组件，这个是React生命周期的重要方法。后面详细分析。
        // mountComponent返回React组件解析的HTML。不同的ReactComponent的mountComponent策略不同，可以看做多态
        // 上面的<h1>Hello, world!</h1>, 对应的是ReactDOMTextComponent，最终解析成的HTML为
        // <h1 data-reactroot="">Hello, world!</h1>
        //var markup = mountComponent(wrapperInstance, transaction, null, ReactDOMContainerInfo(wrapperInstance, container), context);
        //ReactMount._mountImageIntoNode(markup, container, wrapperInstance, shouldReuseMarkup, transaction);
    }
}

function instantiateReactComponent(node) {
    let instance;
    if (node === null || node === false) {
        //创建空组件
        instance = null;
    } else if (typeof node === 'object') {
        // 组件对象，包括DOM原生的和React自定义组件
        var element = node;

        // 根据ReactElement中的type字段区分
        if (typeof element.type === 'string') {
            // type为string则表示DOM原生对象，比如div span等。可以参看上面babel转译的那段代码
            instance = new ReactDOMComponent(element);
        } else {
            // React自定义组件
            instance = new ReactCompositeComponent(element);
        }

    } else if (typeof node === 'string' || typeof node === 'number') {
        // 元素是一个string时，对应的比如<span>123</span> 中的123
        // 本质上它不是一个ReactElement，但为了统一，也按照同样流程处理，称为ReactDOMTextComponent
        instance = new ReactDOMTextComponent(node);
    }

    // 初始化参数，这两个参数是DOM diff时用到的
    instance._mountIndex = 0;
    instance._mountImage = null;

    return instance;
}

export default ReactMount
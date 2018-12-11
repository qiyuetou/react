import {ReactElement} from './element';

var topLevelRootCounter = 1;
var TopLevelWrapper = function () {
    this.rootID = topLevelRootCounter++;
};
TopLevelWrapper.prototype.isReactComponent = {};
if (process.env.NODE_ENV !== 'production') {
    TopLevelWrapper.displayName = 'TopLevelWrapper';
}
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
        return ReactMount._renderSubtreeIntoContainer(null, nextElement, container, callback);
    },
    //这个函数是模拟生成的  ReactComponent
    getTopLevelWrapperInContainer : function(container){
        if (!container) {
            return null;
        }

        if (container.nodeType === DOC_NODE_TYPE) {
            return container.documentElement;
        } else {
            return container.firstChild;
        }
    },
    _updateRootComponent : function(){

    },
    /**
     * 将ReactElement插入DOM中，并返回ReactElement对应的ReactComponent。
     * ReactElement是React元素在内存中的表示形式，可以理解为一个数据类，包含type，key，refs，props等成员变量
     * ReactComponent是React元素的操作类，包含mountComponent(), updateComponent()等很多操作组件的方法
     *
     * @param {parentComponent} 父组件，对于第一次渲染，为null
     * @param {nextElement} 要插入到DOM中的组件，对应上面例子中的<h1>Hello, world!</h1>经过babel转译后的元素
     * @param {container} 要插入到的容器，对应上面例子中的document.getElementById('example')获取的DOM对象
     * @param {callback} 第一次渲染为null
     *
     * @return {component}  返回ReactComponent，对于ReactDOM.render()调用，不用管返回值。
     */
    _renderSubtreeIntoContainer : function(parentComponent, nextElement, container, callback){
        // 包装ReactElement，将nextElement挂载到wrapper的props属性下，这段代码不是很关键
        const nextWrappedElement = ReactElement(TopLevelWrapper, null, null, null, null, null, nextElement);
        // 获取要插入到的容器的前一次的ReactComponent，这是为了做DOM diff
        // 对于ReactDOM.render()调用，prevComponent为null
        var prevComponent = getTopLevelWrapperInContainer(container);

        if (prevComponent) {
            // 从prevComponent中获取到prevElement这个数据对象。一定要搞清楚ReactElement和ReactComponent的作用，他们很关键
            var prevWrappedElement = prevComponent._currentElement;
            var prevElement = prevWrappedElement.props;
            // DOM diff精髓，同一层级内，type和key不变时，只用update就行。否则先unmount组件再mount组件
            // 这是React为了避免递归太深，而做的DOM diff前提假设。它只对同一DOM层级，type相同，key(如果有)相同的组件做DOM diff，否则不用比较，直接先unmount再mount。这个假设使得diff算法复杂度从O(n^3)降低为O(n).
            // shouldUpdateReactComponent源码请看后面的分析
            if (shouldUpdateReactComponent(prevElement, nextElement)) {
                var publicInst = prevComponent._renderedComponent.getPublicInstance();
                var updatedCallback = callback && function () {
                        callback.call(publicInst);
                    };
                // 只需要update，调用_updateRootComponent，然后直接return了
                ReactMount._updateRootComponent(prevComponent, nextWrappedElement, container, updatedCallback);
                return publicInst;
            } else {
                // 不做update，直接先卸载再挂载。即unmountComponent,再mountComponent。mountComponent在后面代码中进行
                ReactMount.unmountComponentAtNode(container);
            }
        }

        var reactRootElement = getReactRootElementInContainer(container);
        var containerHasReactMarkup = reactRootElement && !!internalGetID(reactRootElement);
        var containerHasNonRootReactChild = hasNonRootReactChild(container);

        var shouldReuseMarkup = containerHasReactMarkup && !prevComponent && !containerHasNonRootReactChild;
        // 初始化，渲染组件，然后插入到DOM中。_renderNewRootComponent很关键，后面详细分析
        var component = ReactMount._renderNewRootComponent(nextWrappedElement, container, shouldReuseMarkup, parentComponent != null ? parentComponent._reactInternalInstance._processChildContext(parentComponent._reactInternalInstance._context) : emptyObject)._renderedComponent.getPublicInstance();
        // render方法中带入的回调，ReactDOM.render()调用时一般不传入
        if (callback) {
            callback.call(component);
        }
        return component;
    },
    _render(nextElement, container, callback){
        //上一次的element
        let prevComponent = createElement();
        if (prevComponent) {
            var prevWrappedElement = prevComponent._currentElement;
            var prevElement = prevWrappedElement.props;
            if (shouldUpdateReactComponent(prevElement, nextElement)) {
                //更新页面
            }else{
                //卸载组件
                ReactMount.unmountComponentAtNode(container);
            }
        }
        //
    }
}

function instantiateReactComponent(node, shouldHaveDebugID) {
    let instance;
    if (node === null || node === false) {
        //创建空组件
        instance = ReactEmptyComponent.create(instantiateReactComponent);
    } else if (typeof node === 'object') {
        // 组件对象，包括DOM原生的和React自定义组件
        var element = node;

        // 根据ReactElement中的type字段区分
        if (typeof element.type === 'string') {
            // type为string则表示DOM原生对象，比如div span等。可以参看上面babel转译的那段代码
            instance = ReactHostComponent.createInternalComponent(element);
        } else {
            // React自定义组件
            instance = new ReactCompositeComponentWrapper(element);
        }

    } else if (typeof node === 'string' || typeof node === 'number') {
        // 元素是一个string时，对应的比如<span>123</span> 中的123
        // 本质上它不是一个ReactElement，但为了统一，也按照同样流程处理，称为ReactDOMTextComponent
        instance = ReactHostComponent.createInstanceForText(node);
    }

    // 初始化参数，这两个参数是DOM diff时用到的
    instance._mountIndex = 0;
    instance._mountImage = null;

    return instance;
}

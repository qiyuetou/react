import ReactComponent from './Virtual Dom/ReactComponent';
import ReactClass from './Virtual Dom/ReactClass';

const ReactElement = function (type, key, ref, self, source, owner, props) {
    var element = {

        $$typeof: REACT_ELEMENT_TYPE,
        type: type,
        key: key,
        ref: ref,
        props: props,
        _owner: owner
    };
    return element;
}
ReactElement.createElement = function (type, config, children) {
    var propName;

    // Reserved names are extracted
    var props = {};

    var key = null;
    var ref = null;
    var self = null;
    var source = null;

    if (config != null) {

        if (hasValidRef(config)) {
            ref = config.ref;
        }
        if (hasValidKey(config)) {
            key = '' + config.key;
        }

        self = config.__self === undefined ? null : config.__self;
        source = config.__source === undefined ? null : config.__source;
        // Remaining properties are added to a new props object
        for (propName in config) {
            if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                props[propName] = config[propName];
            }
        }
    }

    // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.
    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
        props.children = children;
    } else if (childrenLength > 1) {
        var childArray = Array(childrenLength);
        for (var i = 0; i < childrenLength; i++) {
            childArray[i] = arguments[i + 2];
        }
        props.children = childArray;
    }

    // Resolve default props
    if (type && type.defaultProps) {
        var defaultProps = type.defaultProps;
        for (propName in defaultProps) {
            if (props[propName] === undefined) {
                props[propName] = defaultProps[propName];
            }
        }
    }

    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
};
//实例化 一个react组件
function instantiateReactComponent(node, shouldHaveDebugID) {
    var instance;

    if (node === null || node === false) {
        instance = ReactEmptyComponent.create(instantiateReactComponent);
    } else if (typeof node === 'object') {
        var element = node;

        if (typeof element.type === 'string') {
            instance = ReactHostComponent.createInternalComponent(element);
        }else {
            instance = new ReactCompositeComponentWrapper(element);
        }
    } else if (typeof node === 'string' || typeof node === 'number') {
        instance = ReactHostComponent.createInstanceForText(node);
    }

    instance._mountIndex = 0;
    instance._mountImage = null;

    return instance;
}

var React = {
    Component: ReactComponent,

    createElement: ReactElement.createElement,

    // Classic
    createClass: ReactClass.createClass,
};

export default React;

ReactElement.createElement = function (type, config, children) {
    var propName;

    // Reserved names are extracted
    var props = {};

    var key = null;
    var ref = null;
    var self = null;
    var source = null;

    if (config != null) {
        if (process.env.NODE_ENV !== 'production') {
            process.env.NODE_ENV !== 'production' ? warning(
                    /* eslint-disable no-proto */
                    config.__proto__ == null || config.__proto__ === Object.prototype,
                    /* eslint-enable no-proto */
                    'React.createElement(...): Expected props argument to be a plain object. ' + 'Properties defined in its prototype chain will be ignored.') : void 0;
        }

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
    if (process.env.NODE_ENV !== 'production') {
        if (key || ref) {
            if (typeof props.$$typeof === 'undefined' || props.$$typeof !== REACT_ELEMENT_TYPE) {
                var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
                if (key) {
                    defineKeyPropWarningGetter(props, displayName);
                }
                if (ref) {
                    defineRefPropWarningGetter(props, displayName);
                }
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
        !(element && (typeof element.type === 'function' || typeof element.type === 'string')) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s', element.type == null ? element.type : typeof element.type, getDeclarationErrorAddendum(element._owner)) : _prodInvariant('130', element.type == null ? element.type : typeof element.type, getDeclarationErrorAddendum(element._owner)) : void 0;

        // Special case string values
        if (typeof element.type === 'string') {
            instance = ReactHostComponent.createInternalComponent(element);
        } else if (isInternalComponentType(element.type)) {
            // This is temporarily available for custom components that are not string
            // representations. I.e. ART. Once those are updated to use the string
            // representation, we can drop this code path.
            instance = new element.type(element);

            // We renamed this. Allow the old name for compat. :(
            if (!instance.getHostNode) {
                instance.getHostNode = instance.getNativeNode;
            }
        } else {
            instance = new ReactCompositeComponentWrapper(element);
        }
    } else if (typeof node === 'string' || typeof node === 'number') {
        instance = ReactHostComponent.createInstanceForText(node);
    } else {
        !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Encountered invalid React node of type %s', typeof node) : _prodInvariant('131', typeof node) : void 0;
    }

    if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV !== 'production' ? warning(typeof instance.mountComponent === 'function' && typeof instance.receiveComponent === 'function' && typeof instance.getHostNode === 'function' && typeof instance.unmountComponent === 'function', 'Only React Components can be mounted.') : void 0;
    }

    // These two fields are used by the DOM and ART diffing algorithms
    // respectively. Instead of using expandos on components, we should be
    // storing the state needed by the diffing algorithms elsewhere.
    instance._mountIndex = 0;
    instance._mountImage = null;

    if (process.env.NODE_ENV !== 'production') {
        instance._debugID = shouldHaveDebugID ? nextDebugID++ : 0;
    }

    // Internal instances should fully constructed at this point, so they should
    // not get any new fields added to them at this point.
    if (process.env.NODE_ENV !== 'production') {
        if (Object.preventExtensions) {
            Object.preventExtensions(instance);
        }
    }

    return instance;
}

/**
 步骤 ：
    createElement


 **/
function ReactElement(type, config, children){
    this.type = type;
}
function createElement(type, config, children){

}

export {createElement}
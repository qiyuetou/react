
function ReactComponent(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;

    this.updater = updater || ReactNoopUpdateQueue;
}

ReactComponent.prototype.isReactComponent = {};

ReactComponent.prototype.setState = function (partialState, callback) {
    this.updater.enqueueSetState(this, partialState);

};

export default ReactComponent;
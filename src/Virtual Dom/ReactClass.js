const ReactClass = {
    createClass : function(spec){
        const Constructor = function(props, context, updater){
            this.props = props;
            this.context = context;
            this.refs = {};
            this.updater = updater || ReactNoopUpdateQueue;

            this.state = null;
        }

        return Constructor;
    }
}

export default ReactClass;
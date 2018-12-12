var ReactDOMTextComponent = function(){
    this._currentElement = text;
    this._stringText = '' + text;

    // 存放唯一标识
    this._rootNodeID = null;
    // 存放对应的ReactClass的实例
    this._instance = null;
}
function escapeTextContentForBrowser(text) {
    if (typeof text === 'boolean' || typeof text === 'number') {
        // this shortcircuit helps perf for types that we know will never have
        // special characters, especially given that this function is used often
        // for numeric dom ids.
        return '' + text;
    }
    return escapeHtml(text);
}
function escapeHtml(string) {
    var str = '' + string;
    var match = matchHtmlRegExp.exec(str);

    if (!match) {
        return str;
    }

    var escape;
    var html = '';
    var index = 0;
    var lastIndex = 0;

    for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
            case 34:
                // "
                escape = '&quot;';
                break;
            case 38:
                // &
                escape = '&amp;';
                break;
            case 39:
                // '
                escape = '&#x27;'; // modified from escape-html; used to be '&#39'
                break;
            case 60:
                // <
                escape = '&lt;';
                break;
            case 62:
                // >
                escape = '&gt;';
                break;
            default:
                continue;
        }

        if (lastIndex !== index) {
            html += str.substring(lastIndex, index);
        }

        lastIndex = index + 1;
        html += escape;
    }

    return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}
ReactDOMTextComponent.prototype.mountComponent = function(){
    var openingValue = ' react-text: ' + domID + ' ';
    var closingValue = ' /react-text ';
    var escapedText = escapeTextContentForBrowser(this._stringText);

    return '<!--' + openingValue + '-->' + escapedText + '<!--' + closingValue + '-->';
}
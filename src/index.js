/**
 * Created by daifei on 2018/11/27
 */
'use strict';

import React, { Component } from 'react';

import ReactDOM from 'react-dom';
class Demo extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>这是一个demo</div>
        )
    }
}
class Test extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            text : this.props.text||'34234'
        }
        this.textChange = this.textChange.bind(this);
    }
    textChange(){
        this.setState({
            text : '这是改变后的文字'
        },()=>{
            this.setState({
                text : '这是改变后的文字3'
            })
        })
    }
    render(){
        const {text} = this.state;
        return(
            <div className="root">
                <div className="test-name">
                    <p>这是一个测试页面</p>
                    <div className="duo">
                        <div className="more">
                            than
                        </div>
                        <p>这是一个段落</p>
                    </div>
                </div>
                <div className="miaoshu">
                    <div>yi端描述</div>
                </div>
                123
                <p onClick={this.textChange}>{text}</p>
            </div>
        );
    }
}

ReactDOM.render(<Test text="呵呵"/> ,document.getElementById('root'));

// "use strict";
// import React from './Virtual Dom/React';
// import ReactDom from './Virtual Dom/ReactDom';
//
//
// console.log('----React',React);
// let Ele = React.createElement("ul", { "class": "ul" },
//     React.createElement("li", { "class": "li-one" }, "NO1list",
//         React.createElement("b", null, "a")
//     ),
//     React.createElement("li", { "class": "li-two" }, "NO2list",
//         React.createElement("b", null, "b")
//     ),
//     React.createElement("li", { "class": "li-three" }, "NO3list",
//         React.createElement("b", null, "c")
//     )
// );
// ReactDom.render(<Ele/>,document.getElementById('root'));
//render
//根据element的类型不同，分别实例化ReactDOMTextComponent, ReactDOMComponent, ReactCompositeComponent类。
// 这些类用来管理ReactElement,负责将不同的ReactElement转化成DOM(mountComponent方法),负责更新DOM(receiveComponent方法，updateComponent方法, 如下会介绍)等。
//console.log('----inde',element)




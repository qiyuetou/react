/**
 * Created by daifei on 2018/11/27
 */
// 'use strict';

// import React, { Component } from 'react';

// import ReactDOM from 'react-dom';





"use strict";
import React from './Virtual Dom/React';
import ReactDom from './Virtual Dom/ReactDom';



class Ele extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <ul class="ul">
                <li class="li-one">list1<b>zheshi</b>wenzhi</li>
                <li class="li-two">list2</li>
                <li class="li-three">list3</li>
            </ul>
        )
    }
}
const Box = React.createElement(Ele)
ReactDom.render(Box,document.getElementById('root'));

//根据element的类型不同，分别实例化ReactDOMTextComponent, ReactDOMComponent, ReactCompositeComponent类。
// 这些类用来管理ReactElement,负责将不同的ReactElement转化成DOM(mountComponent方法),负责更新DOM(receiveComponent方法，updateComponent方法, 如下会介绍)等。
//console.log('----inde',element)




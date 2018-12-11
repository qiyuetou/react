
//npm install -g webpack  //全局安装

//npm install --save-dev webpack  //安装到你的项目目录
// npm install --save-dev webpack-dev-server
//npm install --save-dev babel-core babel-loader babel-preset-env babel-preset-react
//npm install --save-dev style-loader css-loader
//npm install --save-dev postcss-loader autoprefixer

//npm install --save react react-dom
//npm install --save-dev html-webpack-plugin

//npm install --save-dev @babel/core @babel/cli @babel/preset-env
//npm install --save @babel/polyfill

// 一个常见的`webpack`配置文件
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    mode: 'development',

    //entry: __dirname + "/src/index.js", //已多次提及的唯一入口文件
    entry:{
        app: './src/index.js',
        //print: './src/print.js'
    },
    devtool: 'source-map',

    output: {
        //path: __dirname + "/dist/",
        //filename: "bundle-[hash].js"
        filename: "bundle.js",
        // filename: 'bundle.js',
        // filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: "./dist", //本地服务器所加载的页面所在的目录
        historyApiFallback: true, //不跳转
        port: 3000,
        inline: true,//实时刷新
        hot: true
    },
    module: {
        rules: [{
            test: /(\.jsx|\.js)$/,
            use: {
                loader: "babel-loader"
            },
            exclude: /node_modules/
        },{
            test: /\.css$/,
            use: [
                {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        localIdentName: '[path][name]__[local]--[hash:base64:5]'
                    }
                }, {
                    loader: "postcss-loader"
                }
            ]
        }]
    },

    plugins: [
        new webpack.BannerPlugin('测试react'),
        new HtmlWebpackPlugin({
           template: path.join(__dirname, "/index.html") //new 一个这个插件的实例，并传入相关的参数
        }),
        //new webpack.optimize.OccurrenceOrderPlugin(),
        //new webpack.optimize.UglifyJsPlugin(),
        //new ExtractTextPlugin("style.css")
    ]
};


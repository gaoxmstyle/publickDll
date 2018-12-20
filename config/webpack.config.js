const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [paths.appIndexJs],
    output: {
        path: paths.appBuild,
        libraryTarget: 'umd',
        filename: 'js/[name].js',
        publicPath: './',
        globalObject: 'typeof self !== "undefined" ? self : this'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'babel-loader'  
                    },
                    {
                        loader: 'ts-loader'
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'example/toast.html',
            inject: 'head'
        })
    ]
};
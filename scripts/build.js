process.env.NODE_ENV = 'production';

const path = require('path');
const webpackConfig = require('../config/webpack.config.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

// 生产模式
webpackConfig.mode = 'production';

// 抽取公共模块
webpackConfig.optimization = {
    splitChunks: {
        cacheGroups: {
            vendor: {
                test: /node_modules/,
                chunks: 'initial',
                name: 'vendor',
                priority: 10
            },
            commonJS: {
                test: /\.js$/,
                chunks: 'initial',
                name: 'commonJS',
                minSize: 0
            }
        },
    }
};

webpackConfig.plugins = webpackConfig.plugins.concat(
    [
        new CleanWebpackPlugin(['dist'], path.resolve('./'))
    ]
);

webpack(webpackConfig, function (err, stats) {
    if (err) {
        console.error(err);
        return;
    }

    console.log(stats.toString({
        chunks: false,
        colors: true
    }));
});
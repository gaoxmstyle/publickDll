const path = require('path');
const webpackConfig = require('../config/webpack.config.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

// 生产模式
webpackConfig.mode = 'development';

// 抽取公共模块
webpackConfig.optimization = {
    minimize: true
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
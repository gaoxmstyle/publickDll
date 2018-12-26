const path = require('path');
const webpackConfig = require('../config/webpack.config.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const webpack = require('webpack');

webpackConfig.output.filename = 'js/[name].[chunkhash:8].js';

// 生产模式
webpackConfig.mode = 'development';

// 抽取公共模块
webpackConfig.optimization = {
    minimizer: [
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: false
        }),
        new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
        cacheGroups: {
            styles: {
                name: 'styles',
                test: /\.css$/,
                chunks: 'all',
                enforce: true,
                minSize: 0
            }
        }
    }
};

webpackConfig.module.rules = webpackConfig.module.rules.concat([
    {
        test: /\.scss$/,
        use: [
            MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
            },
            {
                loader:'postcss-loader',
                options: {
                    config: {
                        path: './config/postcss.config.js'
                    }
                }
            },
            {
                loader: 'sass-loader',
                options: {
                    outputStyle: 'compressed'
                }
            }
        ]
    }
]);

webpackConfig.plugins = webpackConfig.plugins.concat(
    [
        new CleanWebpackPlugin(['dist'], path.resolve('./')),
        new MiniCssExtractPlugin({filename: './css/[name].[chunkhash:8].css', chunkFilename: '[id].css', allChunks: true})
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
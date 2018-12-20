const webpack = require('webpack');
const webpackConfig = require('../config/webpack.config');
const WebpackDevServer = require('webpack-dev-server');
const open = require('opn');

const options = {
    host: 'localhost',
    port: '6646',
    disableHostCheck: true,
    stats: {
        colors: true
    },
    hot: true,
    overlay: true,
    watchOptions: {
        ignored: /node_modules/
    }
};

webpackConfig.mode = 'development'; // 开发模式

webpackConfig.module.rules = webpackConfig.module.rules.concat(
    [
        {
            test:/\.html$/,
            use:[
                {
                    loader: 'html-loader',
                }
            ]
        },
        {
            test: /\.scss$/,
            use: [
                {
                    loader: 'style-loader'
                },
                {
                    loader: 'css-loader'
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        config: {
                            path: './config/postcss.config.js'
                        }
                    }
                },
                {
                    loader: 'sass-loader'
                }
            ]
        }
    ]
)

webpackConfig.plugins = webpackConfig.plugins.concat([new webpack.HotModuleReplacementPlugin()]);

WebpackDevServer.addDevServerEntrypoints(webpackConfig, options);

let compiler = webpack(webpackConfig);


let server = new WebpackDevServer(compiler, options);

server.listen(options.port, options.host, function(){
    let url = `http://${options.host}:${options.port}`;
    console.log('Starting server on' + url);
    open(url);
});
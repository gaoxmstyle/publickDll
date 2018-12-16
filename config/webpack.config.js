const paths = require('./paths');

module.exports = {
    entry: [paths.appIndexJs],
    output: {
        path: paths.appBuild,
        filename: 'js/[name].[chunkhash:8].js',
        publicPath: './'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader'
                },
                exclude: /node_modules/
            }
        ]
    },
    plugins: []
};
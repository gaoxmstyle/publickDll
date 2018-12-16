const paths = require('./paths');

module.exports = {
    entry: [paths.appIndexJs],
    output: {
        path: paths.appBuild,
        
    }
};
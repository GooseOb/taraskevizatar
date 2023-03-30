const {cfg} = require('./default');

module.exports = Object.assign(cfg, {
    mode: 'development',
    devtool: 'source-map'
});
module.exports = {
    entry: './app.js',
    output: {
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            { test: /\.html/, use: 'handlebars-loader' },
        ]
    }
};
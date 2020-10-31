const webpack = require('webpack');
const merge = require('webpack-merge');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common');

module.exports = merge(common, {
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        // new webpack.optimize.UglifyJsPlugin(),
    ],
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
});

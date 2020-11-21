const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const LoadablePlugin = require('@loadable/webpack-plugin')

module.exports = {
    entry: ['./src/app/index.js'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../public-build')
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                }
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new MomentLocalesPlugin(),
        new LoadablePlugin()
    ]
};

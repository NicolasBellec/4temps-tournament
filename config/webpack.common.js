const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
    ]
};

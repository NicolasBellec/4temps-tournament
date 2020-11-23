const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const LoadablePlugin = require('@loadable/webpack-plugin')

module.exports = {
    entry: ['./src/app/index.js'],
    context: path.resolve(__dirname, '../'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../public-build')
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                  {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                      esModule: true,
                      modules: {
                        namedExport: true,
                      }
                    },
                  },
                  {
                    loader: 'css-loader',
                    // options: {
                    //   esModule: true,
                    //   modules: {
                    //     namedExport: true,
                    //     localIdentName: '[path]___[name]__[local]'
                    //   },
                    //   importLoaders: 1
                    // },
                  },
                  // using postcss as there is a bug in the generation of hash
                  // between css-loader and babel-plugin-react-css-module
                  // workaround found here: https://github.com/webpack-contrib/css-loader/issues/877#issuecomment-514461524
                  {
                    loader: 'postcss-loader',
                    options: {
                      postcssOptions: {
                        plugins: [
                          'postcss-import',
                          [
                            'postcss-modules',
                            {
                              generateScopedName: '[path]___[name]__[local]__[hash:base64:5]',
                            }
                          ]
                      ]
                      },
                    }
                  }
                ]
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
        new MiniCssExtractPlugin({
          filename: 'app.css'
        }),
        new MomentLocalesPlugin(),
        new LoadablePlugin()
    ]
};

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const bootstrapEntryPoints = require('./webpack.bootstrap.config.js');

const path = require('path');

const configDev = {
    app: [
        'react-hot-loader/patch',
        // activate HMR for React
        'webpack-dev-server/client?http://localhost:8080',
        // bundle the client for webpack-dev-server
        // and connect to the provided endpoint
        'webpack/hot/only-dev-server',
        // bundle the client for hot reloading
        // only- means to only hot reload for successful updates
        './src/index.js',
    ],
    publicPath: '/',
    css: ['style-loader', 'css-loader', 'sass-loader'],
};

const configProd = {
    app: './src/index.js',
    publicPath: '/',
    css: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader'],
    }),
};

module.exports = (env) => {
    const isDevelopment = env.development === true;
    const isProduction = env.production === true;

    const bootstrapConfig = isProduction ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;
    const config = isProduction ? configProd : configDev;

    return {
        entry: {
            app: config.app,
            bootstrap: bootstrapConfig,
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].bundle.js',
            publicPath: config.publicPath,
        },
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: config.css,
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: 'babel-loader',
                },
                {
                    test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    use: 'url-loader?limit=10000&name=fonts/[name].[ext]',
                },
                {
                    test: /\.(png|jpg|gif)(\?[\s\S]+)?$/,
                    use: 'file-loader?name=images/[name].[ext]',
                },
                {
                    test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
                    use: 'file-loader?name=fonts/[name].[ext]',
                },

                // Use one of these to serve jQuery for Bootstrap scripts:

                // Bootstrap 3
                { test: /bootstrap-sass\/assets\/javascripts\//, use: 'imports-loader?jQuery=jquery' },
            ],
        },
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            stats: 'errors-only',
            hot: true,
        },
        plugins: (function () {
            const plugins = [];
            plugins.push(
                new HtmlWebpackPlugin({
                    template: './src/index.html',
                }),
            );
            if (isDevelopment) {
                plugins.push(
                    new webpack.HotModuleReplacementPlugin(),
                    // enable HMR globally

                    new webpack.NamedModulesPlugin(),
                    // prints more readable module names in the browser console on HMR updates

                    new webpack.NoEmitOnErrorsPlugin(),
                    // do not emit compiled assets that include errors

                    new webpack.ProvidePlugin({
                        jQuery: 'jquery',
                        $: 'jquery',
                    }),
                );
            }
            if (isProduction) {
                // add some plugins that are only for production here
                plugins.push(
                    new ExtractTextPlugin({
                        filename: '[name].css',
                        allChunks: true,
                    }),
                );
            }
            return plugins;
        }()),
    };
};

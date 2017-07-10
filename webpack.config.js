var webpack = require('webpack');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var inProduction = (process.env.NODE_ENV === 'production');

module.exports = {
    entry: {
        'vue-guard-component': './src/js/vue-guard-component.js'
    },

    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'js/[name].js',
        libraryTarget: 'umd',
        library: 'vue-guard-component'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: path.join(__dirname, 'node_modules'),
                loader: 'babel-loader'
            },

            {
                test: /\.vue$/,
                exclude: path.join(__dirname, 'node_modules'),
                loader: 'vue-loader',
                options: {
                    loaders: {
                      js: 'babel-loader'
                    }
                }
            }
        ]
    },

    resolve: {
        alias: {
            vue: 'vue/dist/vue.common.js'
        }
    },

    plugins: [
        new CleanWebpackPlugin(['dist/*'], {
            root: __dirname,
            verbose: true,
            dry: false
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: inProduction
        }),
    ]
};

if (inProduction) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin()
    );
}

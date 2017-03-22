// webpack.config.js
const webpack = require('webpack');
const path = require('path');

const debug = process.env.NODE_ENV !== 'production';

module.exports = {
    context: `${__dirname}/src`,
    target: 'web',
    devtool: debug ? 'inline-sourcemap' : false,
    entry: ['./entry.js'],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ['react-html-attrs', 'transform-decorators-legacy'],
                },
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loaders: [
                    {
                        loader: 'style-loader',
                        query: {
                            minimize: true,
                        },
                    },
                    {
                        loader: 'css-loader',
                        query: {
                            minimize: true,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        query: {
                            minimize: true,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        alias: {
            Actions: path.resolve(__dirname, './src/actions/'),
            Components: path.resolve(__dirname, './src/components/'),
            Containers: path.resolve(__dirname, './src/containers/'),
            Constants: path.resolve(__dirname, './src/constants.js'),
            Reducers: path.resolve(__dirname, './src/reducers/'),
            Sass: path.resolve(__dirname, './src/sass/'),
        },
    },
    output: {
        filename: 'bundle.js',
        path: __dirname,
    },
    plugins: debug ? [] : [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(debug ? undefined : 'production'),
            },
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            sourcemap: false,
        }),
    ],
};

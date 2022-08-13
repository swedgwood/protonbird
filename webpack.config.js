const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: {
        background: './src/background.ts',
        options: "./src/options.ts",
    },
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimize: false
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "background.html",
            template: "./src/background.html",
            chunks: ["background"],
        }),
        new HtmlWebpackPlugin({
            filename: "options.html",
            template: "./src/options.html",
            chunks: ["options"],
        }),
        new CopyPlugin({
            patterns: [
                "./src/manifest.json"
            ]
        })
    ]
};
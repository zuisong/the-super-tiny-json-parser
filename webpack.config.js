const path = require('path');

var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
var CleanWebpackPlugin = require("clean-webpack-plugin");

const output_path = path.resolve(__dirname, 'dist');

module.exports = {
    mode: 'production',
    entry: './index.ts',
    output: {
        filename: 'main_[hash].js',
        path: output_path
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    transpileOnly: true,
                    onlyCompileBundledFiles: true,
                    experimentalWatchApi: true,
                },
            },
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new CleanWebpackPlugin(output_path + '/*.*', {
            root: __dirname,
            verbose: true,
            dry: false
        }),
    ]
};
const path = require('path');
const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
    entry: {
        main: './script.js', // Bundle script.js và các import
    },
    output: {
        filename: '[name].min.js', // Tạo script.min.js
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    resolve: {
        fallback: {
            path: require.resolve('path-browserify'),
        },
    },
    plugins: [
        new JavaScriptObfuscator({
            rotateStringArray: true,
            compact: true,
            controlFlowFlattening: true,
        }, ['excluded_bundle_name.js']),
    ],
};
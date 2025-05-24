const path = require('path');
const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
    entry: './script.js', // File input
    output: {
        filename: 'script.min.js', // File output
        path: path.resolve(__dirname, 'dist'), // Thư mục output
    },
    mode: 'production', // Tối ưu hóa mã
    module: {
        rules: [
            {
                test: /\.js$/, // Xử lý các file .js
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
            path: require.resolve('path-browserify'), // Hỗ trợ module path cho browser
        },
    },
    plugins: [
        new JavaScriptObfuscator({
            rotateStringArray: true, // Tên cũ là rotateUnicodeArray
            compact: true,
            controlFlowFlattening: true,
        }, ['excluded_bundle_name.js']),
    ],
};
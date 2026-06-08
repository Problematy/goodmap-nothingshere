const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
    entry: './src/Plugin.jsx',
    output: {
        path: path.resolve(__dirname, '../goodmap_nothingshere/static'),
        publicPath: 'auto',
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'nothingshere',
            filename: 'remoteEntry.js',
            exposes: {
                './Plugin': './src/Plugin.jsx',
            },
            shared: {
                react: { singleton: true, requiredVersion: '^18.2.0' },
                'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
            },
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
};

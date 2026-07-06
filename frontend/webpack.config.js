const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
    // A federation-only remote has no app to run; ModuleFederationPlugin emits the
    // useful output (remoteEntry.js), so no entry chunk is needed.
    entry: {},
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '../goodmap_nothingshere/static'),
        publicPath: 'auto',
        // Content-hashed chunk names so rebuilt code never serves stale from browser cache.
        // The Module Federation container keeps its fixed name ('remoteEntry.js') below, so
        // the URL goodmap requests stays stable while the lazy chunks bust their own cache.
        filename: '[name].[contenthash].js',
        chunkFilename: '[id].[contenthash].js',
        clean: { keep: '.gitkeep' },
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'nothingshere',
            filename: 'remoteEntry.js',
            // One expose per capability, keyed by the module goodmap derives from the
            // capability base name (MapOverlayPluginBase -> "./MapOverlay").
            exposes: {
                './MapOverlay': './src/MapOverlay.jsx',
            },
            // Borrow the host's single React instance so hooks work across the boundary.
            shared: {
                react: { singleton: true, requiredVersion: false },
                'react-dom': { singleton: true, requiredVersion: false },
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

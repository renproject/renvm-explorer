const webpack = require("webpack");

module.exports = {
    reactScriptsVersion: "react-scripts",
    style: {
        css: {
            loaderOptions: () => {
                return {
                    url: false,
                };
            },
        },
    },
    webpack: {
        configure: (webpackConfig) => {
            return {
                ...webpackConfig,
                // Polyfills for stream and buffer, required by
                // @renproject/chains dependencies.
                resolve: {
                    ...webpackConfig.resolve,
                    fallback: {
                        // url: require.resolve("url"),
                        // fs: require.resolve("fs"),
                        // assert: require.resolve("assert"),
                        // crypto: require.resolve("crypto-browserify"),
                        // http: require.resolve("stream-http"),
                        // https: require.resolve("https-browserify"),
                        // os: require.resolve("os-browserify/browser"),
                        buffer: require.resolve("buffer"),
                        stream: require.resolve("stream-browserify"),
                        // path: require.resolve("path-browserify"),
                    },
                },
                // Ignore errors thrown by @terra-money/terra.proto.
                ignoreWarnings: [/Failed to parse source map/],
                plugins: [
                    ...webpackConfig.plugins,
                    new webpack.ProvidePlugin({
                        // process: "process/browser",
                        Buffer: ["buffer", "Buffer"],
                    }),
                ],
            };
        },
    },
};

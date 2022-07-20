"use strict";

const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("@nenado/interpolate-html-plugin");
// const HashOutput = require("webpack-plugin-hash-output");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const paths = require("./paths");
const getClientEnvironment = require("./env");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const XMLWebpackPlugin = require("xml-webpack-plugin");
const ForkTsCheckerNotifierWebpackPlugin = require("fork-ts-checker-notifier-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath;
// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
const shouldUseRelativeAssetPaths = publicPath === "./";
// Source maps are resource heavy and can cause out of memory issue for large source files.
// const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = publicPath.slice(0, -1);
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

const CEP_VERSION = require("../src/appVersion").version;
const IS_DEV_BUILD = true;

// Assert this just to be safe.
// Development builds of React are slow and not intended for production.
if (env.stringified["process.env"].NODE_ENV !== '"production"') {
    throw new Error("Production builds must have NODE_ENV=production.");
}

// Note: defined here because it will be used more than once.
const cssFilename = "static/css/[name].[hash:8].css";

// Needed for AESP.js licencing
const nodeModules = {};

// TODO: UNCOMMENT WHEN LICENSE
fs.readdirSync("src/licensing/node_modules")
    .filter(function (x) {
        return [".bin"].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = "commonjs " + mod;
    });

const manifestFile = [
    {
        template: "src/manifest.ejs",
        filename: "manifest.xml",
        data: {
            CEP_VERSION,
        },
    },
];

const InputHtmlFiles = [
    new HtmlWebpackPlugin({
        IS_DEV_BUILD,
        CEP_VERSION,
        // This can be enabled, and then the output file will be injected as script tag, bit loader might not work
        // Loader already not working, so maybe can be changed in future
        inject: false,
        title: "Datamosh 2",
        template: paths.cepAppHtml,
    }),
    new HtmlWebpackPlugin({
        IS_DEV_BUILD,
        CEP_VERSION,
        // This can be enabled, and then the output file will be injected as script tag, bit loader might not work
        // Loader already not working, so maybe can be changed in future
        inject: false,
        title: "Datamosh 2 Settings",
        template: paths.cepAppSettingsHtml,
        filename: "settings.html",
    }),
];

const minimizerOptions = process.env.BUILD_FOR_AESCRIPTS
    ? {
        optimization: {
            // splitChunks: { chunks: "all" },
            minimizer: [
                new TerserPlugin({
                    sourceMap: true, // Must be set to true if using source-maps in production
                    terserOptions: {
                        compress: {
                            drop_console: true,
                        },
                    },
                }),
            ],
        },
    }
    : {};

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = {
    // Don't attempt to continue if there are any errors.
    target: "node",
    externals: nodeModules,
    bail: true,
    // cache: {
    //     type: "filesystem",
    // },
    // infrastructureLogging: {
    //     debug: /webpack\.cache/,
    // },
    mode:
        process.env.BUILD_FOR_AESCRIPTS === "true"
            ? "production"
            : "development",
    devtool:
        process.env.BUILD_FOR_AESCRIPTS === "true"
            ? "cheap-module-source-map"
            : process.env.BUILD_FOR_BUNDLE_ANALYSIS === "true"
            ? "source-map"
            : "source-map", // Is it faster?
    // In production, we only want to load the polyfills and the app code.
    entry: {
        main: paths.appIndexJs,
    },
    // node: {
    //     __dirname: false,
    // },
    output: {
        // This is from https://medium.com/@kenneth_chau/speeding-up-webpack-typescript-incremental-builds-by-7x-3912ba4c1d15
        pathinfo: false,
        hashFunction: "md5",
        // The build folder.
        path: paths.appBuild,
        filename: (fileData) => {
            const { hash, name } = fileData.chunk;
            const timestamp = new Date().getTime().toString().slice(3, 10);
            // This is magic, don't touch, hash should be unchanged here and exist as ${hash}
            // See source of webpack-plugin-hash-output for more details
            return `${name}.${hash[3]}${hash[6]}${timestamp}${hash}.js`;
        },
        // filename: 'static/js/[name].[chunkhash].js',
        chunkFilename: "[name].[chunkhash].chunk.js",
        publicPath: "/",
    },
    resolve: {
        modules: ["node_modules", paths.appNodeModules].concat(
            // It is guaranteed to exist because we tweak it in `env.js`
            process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
        ),
        extensions: [".ts", ".tsx", ".js", ".json", ".jsx"],
        plugins: [
            new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
            new TsconfigPathsPlugin({
                configFile: paths.appTsProdConfig,
            }),
        ],
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.(ts|tsx)$/,
                enforce: "pre",
                use: [
                    {
                        loader: "eslint-loader",
                        options: {
                            fix: false,
                            emitWarning: true,
                            failOnWarning: true,
                            configFile: paths.esLintConfig,
                        },
                    },
                ],
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    { loader: "style-loader" }, // creates style nodes from JS strings
                    { loader: "css-loader" }, // translates CSS into CommonJS
                ],
            },
            {
                oneOf: [
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve("url-loader"),
                        options: {
                            limit: 10000,
                            name: "static/media/[name].[hash:8].[ext]",
                        },
                    },
                    {
                        test: /\.(js|jsx|mjs)$/,
                        include: paths.appSrc,
                        loader: require.resolve("babel-loader"),
                        options: {
                            compact: true,
                        },
                    },
                    {
                        test: /\.(ts|tsx)$/,
                        include: paths.appSrc,
                        exclude: /node_modules/,
                        use: [
                            {
                                loader: require.resolve("babel-loader"),
                                options: { babelrc: true },
                            },
                        ],
                    },
                    {
                        loader: require.resolve("file-loader"),
                        exclude: [
                            /\.(js|jsx|mjs)$/,
                            /\.html$/,
                            /\.json$/,
                            /\.scss$/,
                            /\.css$/,
                        ],
                        options: {
                            name: "static/media/[name].[hash:8].[ext]",
                        },
                    },
                    // ** STOP ** Are you adding a new loader?
                    // Make sure to add the new loader(s) before the "file" loader.
                ],
            },
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            async: true,
        }),
        new ForkTsCheckerNotifierWebpackPlugin({
            title: "TypeScript",
            excludeWarnings: false,
        }),
        new InterpolateHtmlPlugin(env.raw),
        new webpack.DefinePlugin(env.stringified),
        ...InputHtmlFiles,
        new XMLWebpackPlugin({
            files: manifestFile,
        }),
    ],
    ...minimizerOptions,
    stats: {
        optimizationBailout: true,
    },
};

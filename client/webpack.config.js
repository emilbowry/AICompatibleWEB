const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
require("dotenv").config(); // This loads the .env fil

module.exports = (env, argv) => {
	const isProduction = argv.mode === "production";
	const faviconRegex = /favicon|apple-touch-icon|android-chrome|manifest/i;

	return {
		mode: isProduction ? "production" : "development",

		entry: path.resolve(__dirname, "src/index.tsx"),

		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "bundle.js",
			clean: true,
			publicPath: "/",
		},

		devtool: isProduction ? "source-map" : "eval-source-map",

		devServer: isProduction
			? undefined
			: {
					static: path.resolve(__dirname, "build"),
					port: 3000,
					hot: true,
					open: true,
					historyApiFallback: true,

					proxy: [
						{
							context: ["/api"],
							target: "http://localhost:7878",
							changeOrigin: true,
						},
					],
			  },
		resolve: {
			extensions: [".ts", ".tsx", ".js", ".jsx"],
		},

		module: {
			rules: [
				{
					test: /\.[jt]sx?$/,
					exclude: /node_modules/,
					use: "babel-loader",
				},
				{
					test: /\.ics$/i,
					type: "asset/resource",
					generator: {
						filename: "static/media/[name].[hash][ext]",
					},
				},
				{
					test: /\.module\.css$/i,
					use: [
						"style-loader",
						{
							loader: "css-loader",
							options: {
								modules: true,
								esModule: false,
							},
						},
					],
				},
				{
					test: faviconRegex,
					type: "asset/resource",
					generator: {
						filename: "[name][ext]",
					},
				},
				{
					test: /\.(png|jpe?g|gif|ico)$/i,
					exclude: faviconRegex,
					oneOf: [
						{
							resourceQuery: /inline/,
							type: "asset/inline",
						},
						{
							type: "asset/resource",
						},
					],
				},
				{
					test: /\.css$/i,
					exclude: /\.module\.css$/i,
					use: ["style-loader", "css-loader"],
				},
				{
					test: /\.svg$/i,
					type: "asset/resource",
				},
			],
		},

		plugins: [
			new HtmlWebpackPlugin({
				template: "public/index.html",
				favicon: "public/favicon.ico",
			}),
		],
	};
};

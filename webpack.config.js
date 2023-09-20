
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SignageOSPlugin = require('@signageos/webpack-plugin')

module.exports = (_env, argv) => {
	if (argv.mode === 'development' && argv.serveIndex) {
		// webpack-dev-server
		require('./tools/cors-anywhere');
	}

	return {
		entry: "./src/index",
		target: "web",
		infrastructureLogging: {
			level: 'warn',
		},
		output: {
			filename: 'index.js',
		},
		resolve: {
			extensions: [".ts",".tsx",".js"],
		},
		module: {
			rules: [
				{
					test: /^(.(?!\.module\.css))*\.css$/,
					use: ['style-loader', 'css-loader'],
				},
				{
					test: /\.jsx?$/,
					loader: 'babel-loader',
					options: { presets: [require.resolve('@babel/preset-env')] },
					enforce: 'post',
				},
				{
					test: /\.tsx?$/,
					loader: 'ts-loader'
				},
			],
		},
		plugins: [
				new HtmlWebpackPlugin({
					template: 'public/index.html',
				}),
				new SignageOSPlugin()
		],
	}
};

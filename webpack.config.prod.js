const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');

process.env.NODE_ENV = 'development';
var CompressionPlugin = require('compression-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');

process.env.NODE_ENV = 'development';

module.exports = {
	cache: true,
	debug: true,
	devtool: 'source-map',
	devServer: {
		inline: true,
		port: 3333
	},
	resolve: {
		"alias": {
	      "react": "preact-compat",
	      "react-dom": "preact-compat"
	    },
		root: path.resolve('src'),
		extensions: ['.js', '.json', '.jsx'],
	},
	resolveLoader: {
		root: [path.join(process.cwd(), 'node_modules')]
	},
	entry: [
		
		path.resolve('src/index.jsx'),
	],
	output: {
		path: path.resolve('build'),
		filename: 'static/js/bundle.js',
		sourceMapFilename: 'bundle.map',
		publicPath: '/'
	},
	plugins: [
		new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
		new HtmlWebpackPlugin({
			inject: true,
			template: path.resolve('public/index.html'),
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
	      'process.env': {
	        'NODE_ENV': JSON.stringify('production')
	      }
	    }),
	    new webpack.optimize.UglifyJsPlugin({
	    	sourceMap: true, minimize: true,
	      mangle: true,
	      compress: {
	        warnings: false, // Suppress uglification warnings
	        pure_getters: true,
	        unsafe: true,
	        unsafe_comps: true,
	        screw_ie8: true
	      },
	      output: {
	        comments: false,
	      },
	      exclude: [/\.min\.js$/gi] // skip pre-minified libs
	    }),
	    new webpack.optimize.AggressiveMergingPlugin(),
	    new CompressionPlugin({
	      asset: "[path].gz[query]",
	      algorithm: "gzip",
	      test: /\.js$|\.css$|\.html$/,
	      threshold: 10240,
	      minRatio: 0.8
	    })
	],
	module: {
		preLoaders: [{
			test: /\.(js|jsx)$/,
			loader: 'eslint',
			exclude: [/node_modules/]
		}],
		loaders: [{
			exclude: [
				/\.html$/,
				/\.(js|jsx)$/,
				/\.scss$/,
				/\.css$/,
				/\.json$/,
				/\.svg$/
			],
			loader: 'url',
			query: {
				limit: 10000,
				name: 'static/media/[name].[hash:8].[ext]'
			}
		}, {
			test: /\.css$/,
			loader: 'style!css?importLoaders=1!postcss'
		},{
			test: /\.scss$/,
			loader: 'style!css?importLoaders=1&localIdentName=[local]_[hash:base64:5]!postcss!sass'
		},{
			test: /\.(js|jsx)$/,
			include: [/(src|test)/],
			loader: 'babel'
		}]
	},
	postcss: function() {
		return [
			autoprefixer({
				browsers: [
					'>1%',
					'last 4 versions',
					'Firefox ESR',
					'not ie < 9',
				]
			}),
		];
	},
	eslint: {
		failOnError: true,
	},
	node: {
	   fs: "empty"
	}
};

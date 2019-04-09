var path = require('path');
var HtmlWebpackPlugin  = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
const extractCSS = new ExtractTextPlugin({ filename: 'css.bundle.css' });


// var CleanWebpackPlugin = require('clean-webpack-plugin');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
// const MinifyPlugin = require('babel-minify-webpack-plugin');


module.exports = {
  mode: 'development',
  entry: './src/app.js',
  devServer: {
    historyApiFallback:true,
    inline:true,
    port: 8008
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './app.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use:[
          {
            loader:'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [require('@babel/plugin-proposal-object-rest-spread')]
            }
          },
          {
            loader:'click-loader',
          }
        ]
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({ // Instance 1
          fallback: 'style-loader',
          use: [ 'css-loader' ]
        })
      },
      {
        test:/\.html$/,
        use:['html-loader']
      },
      {
        test:/\.html$/,
        use:[
          {
            loader:'file-loader',
            options:{
              name:'[name].[ext]',
            }
          }
        ],
        exclude:path.resolve(__dirname,'./src/index.html')
      },
      {
        test:/\.(jpg|png)$/,
        use:[
          {
            loader:'file-loader',
            options:{
              name:'[name].[ext]',
              outputPath:'img/',
              publicPath:'img/'
            }
          }
        ]
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:'./src/index.html'
    }),
    new BaseHrefWebpackPlugin({
      baseHref:  process.env['npm_lifecycle_event'] == 'click' ? '/' : './'
    }),
    new OpenBrowserPlugin({ url: 'http://localhost:8008' }),
    extractCSS,
  ]
};

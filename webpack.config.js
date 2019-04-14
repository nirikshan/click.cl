var path = require('path');
var HtmlWebpackPlugin  = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { ClickBaseManager } = require('click-base-manager');
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
    stats: 'minimal',
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
              plugins: [
                require('@babel/plugin-proposal-object-rest-spread'),
                "@babel/plugin-syntax-dynamic-import"
              ]
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
        test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
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
    new ClickBaseManager({
      baseHref:  process.env['npm_lifecycle_event'] == 'click' ? '/' : './'
    }),
    new OpenBrowserPlugin({ url: 'http://localhost:8008' }),
    extractCSS,
  ]
};

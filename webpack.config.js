const path = require("path");
const webpack = require("webpack");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    target: "web",
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ["babel-loader"]
        }, {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        }, {
          test: /\.(scss)$/,
          use: [{
            loader: 'style-loader', // inject CSS to page
          }, {
            loader: 'css-loader', // translates CSS into CommonJS modules
          }, {
            loader: 'postcss-loader', // Run postcss actions
            options: {
              plugins: function () { // postcss plugins, can be exported to postcss.config.js
                return [
                  require('autoprefixer')
                ];
              }
            }
          }, {
            loader: 'sass-loader' // compiles Sass to CSS
          }]
        }, {
          test: /\.svg$/,
          use: [
            {
              loader: "babel-loader"
            },
            {
              loader: "react-svg-loader",
              options: {
                jsx: true
              }
            }
          ]
        },
      ]
    },
    externals: {
      react: {          
        commonjs: "react",          
        commonjs2: "react",          
        amd: "React",          
        root: "React"      
      },      
      "react-dom": {       
          commonjs: "react-dom",          
          commonjs2: "react-dom",          
          amd: "ReactDOM",          
          root: "ReactDOM"      
      }  
    },
    resolve: { 
      extensions: ["*", ".js", ".jsx"],
      alias: { 
          'react': path.resolve(__dirname, './node_modules/react') ,
          'react-dom': path.resolve(__dirname, './node_modules/react-dom')
      }
    },
    output: {
      path: path.resolve(__dirname,"dist"),
      filename: "index.js",
      library: '',
      libraryTarget: 'umd'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new CleanWebpackPlugin()
    ]
  };
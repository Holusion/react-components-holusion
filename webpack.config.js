const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: "./src/index.js",
    target: "electron-renderer",
    mode: "development",
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ["babel-loader"]
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name]-[hash:8].[ext]",
                publicPath: "../dist"
              }
            }
          ]
        }
      ]
    },
    resolve: { extensions: ["*", ".js", ".jsx"] },
    output: {
      path: __dirname,
      filename: "index.js",
      libraryTarget: 'commonjs2'
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
  };
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
    resolve: { extensions: ["*", ".js", ".jsx"] },
    output: {
      path: __dirname,
      filename: "index.js",
      libraryTarget: 'commonjs2'
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
  };
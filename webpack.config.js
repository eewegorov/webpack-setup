const HtmlWebpackPlugin = require("html-webpack-plugin"); // Require  html-webpack-plugin plugin
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
// const DashboardPlugin = require("webpack-dashboard/plugin");
const webpack = require("webpack");
require("dotenv").config();

const ENV = process.env.APP_ENV;
const isTest = ENV === "test";
const isProd = ENV === "prod";

function setDevTool() {
  if (isTest) return "inline-source-map";
  else if (isProd) return "source-map";
  else return "eval-source-map";
}

const config = {
  entry: __dirname + "/src/app/index.js", // webpack entry point. Module to start building dependency graph
  output: {
    path: __dirname + "/dist", // Folder to store generated bundle
    filename: "bundle.js", // Name of generated bundle after build
    publicPath: "/", // public URL of the output directory when referenced in a browser
  },
  devtool: setDevTool(),
  module: {
    // where we defined file patterns and their loaders
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: [/node_modules/],
      },
      {
        test: /\.html/,
        loader: "raw-loader",
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    // Array of plugins to apply to build chunk
    new HtmlWebpackPlugin({
      template: __dirname + "/src/public/index.html",
      inject: "body",
    }),
    new webpack.DefinePlugin({
      API_KEY: JSON.stringify(process.env.API_KEY),
    }),
    // new DashboardPlugin(),
  ],
  devServer: {
    // configuration for webpack-dev-server
    contentBase: "./src/public", //source of static assets
    port: 7700, // port to run dev-server
  },
};

if (isProd) {
  config.plugins.push(
    new UglifyJSPlugin(),
    new CopyWebpackPlugin([{ from: __dirname + "/src/public" }])
  );
}

module.exports = config;

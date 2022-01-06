// webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin")
const Dotenv = require("dotenv-webpack")
const path = require("path")
// node 中與路徑的相關套件
module.exports = {
  entry: ["regenerator-runtime/runtime.js", "./src/index.js"],
  // 進入點，所以檔案必須與此檔案有關聯才會被編譯

  output: {
    filename: "main.[hash].js",
    // 編譯檔案名稱
    path: path.resolve(__dirname, "dist"),
    // 編譯檔案的位置
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|jpg)$/,
        exclude: /node_modules/,
        use: {
          loader: "url-loader?limit=8912",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new Dotenv(),
  ],
}

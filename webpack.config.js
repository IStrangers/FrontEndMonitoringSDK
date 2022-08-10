const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: "./src/index.js",
  context: process.cwd(),
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "monitor.js"
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist")
    },
    onBeforeSetupMiddleware(devServer) {
      const { app } = devServer
      app.post('/logger',function(req,res) {
        res.json({ success: true})
      })
      app.get('/success',function(req,res) {
        res.json({ id: 1})
      })
      app.post('/error',function(req,res) {
        res.sendStatus(5000)
      })
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "head"
    })
  ]
}
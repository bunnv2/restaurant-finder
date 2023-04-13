// webpack.config.js
const Dotenv = require('dotenv-webpack');

module.exports = {
    path: __dirname + '/dist',
    plugins: [
    new Dotenv()
  ]
};
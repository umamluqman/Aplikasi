// next.config.js



// next.config.js
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const withCSS = require('@zeit/next-css')
const withPlugins = require('next-compose-plugins');

const nextConfig = {
  webpack: (config, options) => {
    if (config.resolve.plugins) {
      config.resolve.plugins.push(new TsconfigPathsPlugin());
    } else {
      config.resolve.plugins = [new TsconfigPathsPlugin()];
    }

    return config;
  },
  target: "serverless",
  module: {
   rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  }
}
module.exports = withPlugins([
  nextConfig, withCSS
])
// module.exports = {
//   webpack: (config, options) => {
//     if (config.resolve.plugins) {
//       config.resolve.plugins.push(new TsconfigPathsPlugin());
//     } else {
//       config.resolve.plugins = [new TsconfigPathsPlugin()];
//     }
//
//     return config;
//   },
//   target: "serverless",
//   module: {
//     rules: [
//       {
//         test: /\.css$/,
//         use: ['style-loader', 'css-loader'],
//       },
//     ],
//   }
// };

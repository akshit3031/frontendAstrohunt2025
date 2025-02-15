module.exports = {
    // Other configurations...
    devtool: 'eval-source-map',  // Enable source maps for development (optional)
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          use: ['source-map-loader'],
          exclude: /node_modules\/(?!lucide-react)/, // This will ignore source map warnings for lucide-react
        },
      ],
    },
  };
  
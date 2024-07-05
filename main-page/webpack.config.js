const path = require('path');

module.exports = {
  entry: './src/index.js',  // Adjust entry point as per your project structure
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,  // Apply this rule for .js files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',  // Use babel-loader for transpiling JS files
          options: {
            presets: ['@babel/preset-env'],  // Preset for transpiling modern JS to ES5
          },
        },
      },
      {
        test: /\.css$/,  // Apply this rule for .css files
        use: ['style-loader', 'css-loader'],  // Use style-loader and css-loader for bundling CSS
      },
      {
        test: /\.(png|jpg|gif)$/i,  // Apply this rule for images
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    fallback: {
      fs: false,
      path: false
    }
  }  
};

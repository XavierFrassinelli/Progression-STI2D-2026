const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    energychain: './docs/assets/EnergyChainApp.tsx',
    mechanics: './docs/assets/MechanicsApp.jsx'
  },
  output: {
    path: path.resolve(__dirname, 'docs/assets'),
    filename: 'bundle.[name].js',
    clean: false
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript'
            ]
          }
        }
      }
    ]
  },
  performance: {
    hints: false
  }
};
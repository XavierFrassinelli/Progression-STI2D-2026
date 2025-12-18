import path from 'path';

export default {
  mode: 'production',
  entry: './docs/assets/EnergyChainApp.tsx',
  output: {
    // CORRECTION ICI : On enlève __dirname et on met le chemin relatif
    path: path.resolve('./docs/assets'), 
    
    // Le nom attendu par votre site
    filename: 'bundle.energychain.js',
    
    // IMPORTANT : clean: false pour ne pas effacer vos images !
    clean: false 
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { node: 'current' } }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              ['@babel/preset-typescript']
            ]
          }
        }
      }
    ]
  }
};
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      'three': path.resolve('./node_modules/three'),
      'aframe': path.resolve('./node_modules/aframe'),
      '@utils': path.resolve('./src/utils')
    },
    fallback: {
      'fs': false,
      'path': false
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        three: {
          test: /[\\/]node_modules[\\/](three|three-.*|@three.*)[\\/]/,
          name: 'three',
          chunks: 'all',
          priority: 10,
          enforce: true
        },
        aframe: {
          test: /[\\/]node_modules[\\/]aframe[\\/]/,
          name: 'aframe',
          chunks: 'all',
          priority: 9
        }
      }
    }
  }
}; 
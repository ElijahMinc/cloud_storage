/// <reference types="react-scripts" />

const path = require(`path`);

const craco = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@redux': path.resolve(__dirname, 'src/redux'),
      '@helpers': path.resolve(__dirname, 'src/helpers'),
      '@typesModule': path.resolve(__dirname, 'src/types'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@common': path.resolve(__dirname, 'src/common'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    }
  },
};

export default craco
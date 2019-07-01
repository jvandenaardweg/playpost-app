module.exports = {
  env: {
    production: {
      plugins: ['transform-remove-console']
    },
    staging: {
      plugins: ['transform-remove-console']
    },
    test: {
      plugins: ['transform-remove-console']
    }
  },
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['functional-hmr']
};

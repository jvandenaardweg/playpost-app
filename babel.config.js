module.exports = {
  env: {
    production: {
      plugins: [
        'transform-remove-console'
      ]
    }
  },
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['./'],
        alias: {
          '@': './src',
        },
      }
    ]
  ]
};

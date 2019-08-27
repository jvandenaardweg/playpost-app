module.exports = {
  dependencies: {
    'react-native-config': {
      platforms: {
        ios: null
      }
    },
    'react-native-share-extension': {
      platforms: {
        ios: null,
        android: null
      }
    }
  },
  project: {
    ios: {},
    android: {}, // grouped into "project"
  },
  dependency: {
    assets: ['./src/assets/fonts/'], // stays the same
  }
};

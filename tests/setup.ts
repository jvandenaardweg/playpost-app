// tslint:disable-next-line: no-submodule-imports
import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';

// Taken from: https://github.com/facebook/react-native/blob/master/jest/setup.js#L128
jest.mock('react-native/Libraries/Animated/src/Animated', () => {
  const Animated = jest.requireActual('react-native/Libraries/Animated/src/Animated');
  Animated.Text.__skipSetNativeProps_FOR_TESTS_ONLY = true;
  Animated.View.__skipSetNativeProps_FOR_TESTS_ONLY = true;
  return Animated;
});

// tslint:disable-next-line: no-empty
jest.mock('react-native-localize', () => ({
  getLocales: jest.fn()
}));

jest.mock('react-native-dark-mode', () => ({
  eventEmitter: jest.fn(),
  initialMode: 'light',
  useDarkMode: jest.fn()
}));

// Mock the track player depedency: https://github.com/react-native-kit/react-native-track-player/issues/501#issuecomment-474693116
jest.mock('react-native-track-player', () => ({
  addEventListener: jest.fn(),
  registerEventHandler: jest.fn(),
  registerPlaybackService: jest.fn(),
  setupPlayer: jest.fn(),
  destroy: jest.fn(),
  updateOptions: jest.fn(),
  add: jest.fn(),
  remove: jest.fn(),
  skip: jest.fn(),
  skipToNext: jest.fn(),
  skipToPrevious: jest.fn(),
  removeUpcomingTracks: jest.fn(),
  // playback commands
  reset: jest.fn(),
  play: jest.fn(),
  pause: jest.fn(),
  stop: jest.fn(),
  seekTo: jest.fn(),
  setVolume: jest.fn(),
  setRate: jest.fn(),
  // player getters
  getQueue: jest.fn(),
  getTrack: jest.fn(),
  getCurrentTrack: jest.fn(),
  getVolume: jest.fn(),
  getDuration: jest.fn(),
  getPosition: jest.fn(),
  getBufferedPosition: jest.fn(),
  getState: jest.fn(),
  getRate: jest.fn(),
  ProgressComponent: jest.fn(),
  State: {
    None: 'none'
  },
  Event: {},
  Capability: {},
  PitchAlgorithm: {},
  default: {
    addEventListener: jest.fn(),
    registerEventHandler: jest.fn(),
    registerPlaybackService: jest.fn(),
    setupPlayer: jest.fn(),
    destroy: jest.fn(),
    updateOptions: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
    skip: jest.fn(),
    skipToNext: jest.fn(),
    skipToPrevious: jest.fn(),
    removeUpcomingTracks: jest.fn(),
    // playback commands
    reset: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    stop: jest.fn(),
    seekTo: jest.fn(),
    setVolume: jest.fn(),
    setRate: jest.fn(),
    // player getters
    getQueue: jest.fn(),
    getTrack: jest.fn(),
    getCurrentTrack: jest.fn(),
    getVolume: jest.fn(),
    getDuration: jest.fn(),
    getPosition: jest.fn(),
    getBufferedPosition: jest.fn(),
    getState: jest.fn(),
    getRate: jest.fn(),
  }
}));

jest.mock('@react-native-community/netinfo', () => {
  return {
    isConnected: jest.fn()
  };
});

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn()
}));

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);

jest.mock('rn-fetch-blob', () => {
  return {
    DocumentDir: jest.fn(),
    fetch: jest.fn(),
    base64: jest.fn(),
    android: jest.fn(),
    ios: jest.fn(),
    config: ({ path }: { path: string }) => ({
      fetch: () => ({
        path: jest.fn(() => path)
      })
    }),
    session: jest.fn(),
    fs: {
      dirs: {
        MainBundleDir: jest.fn(),
        CacheDir: jest.fn(),
        DocumentDir: jest.fn(),
      },
    },
    wrap: jest.fn(),
    polyfill: jest.fn(),
    JSONStream: jest.fn()
  }
})

jest.mock('react-native-share-extension');
jest.mock('react-native-iap');
jest.mock('react-native-video');
jest.mock('react-native-splash-screen');
jest.mock('react-native-app-intro-slider');

jest.mock('react-native-fs', () => {
  return {
    exists: jest.fn(),
    unlink: jest.fn(),
    mkdir: jest.fn(),
    readDir: jest.fn(),
    DocumentDirectoryPath: 'local/test/path'
  }
});
jest.mock('react-native-device-info', () => {
  return {
    getDeviceLocale: jest.fn().mockReturnValue('en')
  }
});

// jest.mock('@react-native-firebase/app', () => {
//   return {
//     addListener: jest.fn()
//   }
// });

jest.mock('@react-native-firebase/perf', () => {
  return () => {
    return {
      newHttpMetric: jest.fn()
    }
  }
});

jest.mock('@react-native-firebase/analytics', () => {
  return () => {
    return {
      logEvent: jest.fn().mockResolvedValue(true),
      setUserProperties: jest.fn().mockResolvedValue(true),
      setUserId: jest.fn().mockResolvedValue(true),
      setCurrentScreen: jest.fn().mockResolvedValue(true),
    }
  }
});

jest.mock('@react-native-firebase/crashlytics', () => {
  return () => {
    return {
      recordError: jest.fn()
    }
  }
});


// Below gives TS errors... So we uncomment it for now
// jest.mock('react-navigation', ({
//   withNavigation: (component: any) => component,
//   navigation: {
//     state: { params: {} },
//     dispatch: jest.fn(),
//     goBack: jest.fn(),
//     dismiss: jest.fn(),
//     navigate: jest.fn(),
//     openDrawer: jest.fn(),
//     closeDrawer: jest.fn(),
//     toggleDrawer: jest.fn(),
//     getParam: jest.fn(),
//     setParams: jest.fn(),
//     addListener: jest.fn(),
//     push: jest.fn(),
//     replace: jest.fn(),
//     pop: jest.fn(),
//     popToTop: jest.fn(),
//     isFocused: jest.fn()
//   }
// }));

// Workaround for error:
// Attempted to log "Calling .focus() in the test renderer environment is not supported. Instead, mock out your components that use findNodeHandle with replacements that don't rely on the native environment."
// https://github.com/facebook/jest/issues/3707
// jest.mock('TextInput', () => {
//   const RealComponent = require.requireActual('TextInput');
//   const React = require('React');

//   class TextInput extends React.Component {
//     render() {
//       return React.createElement('TextInput', { ...this.props, autoFocus: false }, this.props.children);
//     }
//   }
//   TextInput.propTypes = RealComponent.propTypes;
//   return TextInput;
// });

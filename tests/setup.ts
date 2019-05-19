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
  getRate: jest.fn()
}));

jest.mock('@react-native-community/netinfo', () => {
  return {
    isConnected: jest.fn()
  };
});

jest.mock('react-native-video');
jest.mock('react-native-splash-screen');
jest.mock('react-native-app-intro-slider');

jest.mock('react-navigation', ({ withNavigation: (component: any) => component }));

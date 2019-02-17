import { AppRegistry } from 'react-native';
// import App from './src/App'
// import Share from './src/Share'
import TrackPlayer from 'react-native-track-player';
import PlaybackService from './src/PlaybackService';
import { name as appName, shareExtensionName } from './app.json';

// Using require instead of the import here so the share extension workds
// Fix from: https://github.com/alinz/react-native-share-extension/issues/94#issuecomment-387488191
AppRegistry.registerComponent(appName, () => require('./src/App').default);
AppRegistry.registerComponent(shareExtensionName, () => require('./src/Share').default);

TrackPlayer.registerPlaybackService(() => PlaybackService);

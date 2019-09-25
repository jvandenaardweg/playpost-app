import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './src/App'
import ShareApp from './src/ShareApp'
import TrackPlayer from 'react-native-track-player';
import PlaybackService from './src/PlaybackService';
import { name as appName, shareExtensionName } from './app.json';

// tslint:disable-next-line:no-console
console.disableYellowBox = true;

// Using require instead of the import here so the share extension workds
// Fix from: https://github.com/alinz/react-native-share-extension/issues/94#issuecomment-387488191
AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent(shareExtensionName, () => ShareApp);

TrackPlayer.registerPlaybackService(() => PlaybackService);

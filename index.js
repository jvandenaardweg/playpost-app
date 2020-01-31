import 'react-native-gesture-handler';

import { AppRegistry } from 'react-native';
import App from './src/App'
import ShareApp from './src/ShareApp'
import TrackPlayer from 'react-native-track-player';
import PlaybackService from './src/PlaybackService';
import { name as appName, shareExtensionName } from './app.json';

// tslint:disable-next-line:no-console
console.disableYellowBox = true;

// Use commented code below to see how much modules we load
// So we can optimize the bundle
// const modules = require.getModules();
// const moduleIds = Object.keys(modules);
// const loadedModuleNames = moduleIds
//   .filter(moduleId => modules[moduleId].isInitialized)
//   .map(moduleId => modules[moduleId].verboseName);
// const waitingModuleNames = moduleIds
//   .filter(moduleId => !modules[moduleId].isInitialized)
//   .map(moduleId => modules[moduleId].verboseName);

// // make sure that the modules you expect to be waiting are actually waiting
// console.log(
//   'loaded:',
//   loadedModuleNames.length,
//   'waiting:',
//   waitingModuleNames.length
// );

// // grab this text blob, and put it in a file named packager/modulePaths.js
// console.log(`module.exports = ${JSON.stringify(loadedModuleNames.sort())};`);

// Using require instead of the import here so the share extension workds
// Fix from: https://github.com/alinz/react-native-share-extension/issues/94#issuecomment-387488191
AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent(shareExtensionName, () => ShareApp);

TrackPlayer.registerPlaybackService(() => PlaybackService);

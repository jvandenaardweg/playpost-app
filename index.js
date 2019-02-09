import { AppRegistry} from 'react-native'
import App from './src/App'
import Share from './src/Share'
import PlaybackService from './src/PlaybackService'
import { name as appName, shareExtensionName } from './app.json'
import TrackPlayer from 'react-native-track-player'

AppRegistry.registerComponent(appName, () => App)
AppRegistry.registerComponent(shareExtensionName, () => Share)

TrackPlayer.registerPlaybackService(() => PlaybackService)

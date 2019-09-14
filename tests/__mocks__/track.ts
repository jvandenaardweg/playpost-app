import * as TrackPlayer from 'react-native-track-player';

import articleMock from './article';

// Get track properties based on an article mock
const audiofileId = articleMock.audiofiles[0].id
const audiofileUrl = articleMock.audiofiles[0].url
const articleTitle = articleMock.title as string;
const articleSourceName = articleMock.sourceName as string;

const track: TrackPlayer.Track = {
  id: audiofileId,
  url: audiofileUrl,
  title: articleTitle,
  artist: articleSourceName,
  userAgent: 'Test UA',
  contentType: 'audio/mpeg',
  pitchAlgorithm: TrackPlayer.PitchAlgorithm && TrackPlayer.PitchAlgorithm.Voice
};

export default track;

import * as TrackPlayer from 'react-native-track-player';
import { createSelector } from 'reselect';

import { RootState } from '../reducers';
import { PlayerState } from '../reducers/player';
import { selectAllPlaylistArticles } from './playlist';

export const playerSelector = (state: RootState): PlayerState => state.player;

export const selectPlayerTrack = createSelector(
  [playerSelector],
  player => player.track
);

export const selectPlayerCurrentArticleId = createSelector(
  [playerSelector],
  player => player.currentArticleId
);

export const selectPlayerPreviousArticleId = createSelector(
  [playerSelector],
  player => player.previousArticleId
);

export const selectErrorCreateAudiofile = createSelector(
  [playerSelector],
  player => player.errorCreateAudiofile
);

export const selectPlayerAudiofile = createSelector(
  [playerSelector],
  player => player.audiofile
);

export const selectPlayerArticleFromAudiofileId = createSelector(
  [selectPlayerTrack, selectAllPlaylistArticles],
  (track, articles): Api.Article | undefined => {
    const audiofileId = track.id;

    if (!track || !audiofileId) { return undefined; }

    // Find the article based on the audiofile id
    const foundArticle = articles.find(article => {
      if (article.audiofiles.length) {
        const foundAudiofile = article.audiofiles.find(audiofile => audiofile.id === audiofileId);
        if (foundAudiofile) { return true; }
      }
      return false;
    });

    return foundArticle;

  }
);

export const selectPlayerAudiofileStatus = createSelector(
  [playerSelector],
  (player): string => {
    const { isCreatingAudiofile, isDownloadingAudiofile } = player;

    if (isCreatingAudiofile && isDownloadingAudiofile) {
      return 'Loading article audio...';
    }

    if (isCreatingAudiofile) { return 'Creating article audio...'; }

    if (isDownloadingAudiofile) { return 'Downloading article audio...'; }

    return '';
  }
);

export const selectPlayerPlaybackState = createSelector(
  [playerSelector],
  player => player.playbackState
);

export const selectPlayerIsPlaying = createSelector(
  [selectPlayerPlaybackState],
  playbackState => [TrackPlayer.State.Playing].includes(playbackState)
);

export const selectPlayerIsStopped = createSelector(
  [selectPlayerPlaybackState],
  playbackState => [TrackPlayer.State.Stopped, TrackPlayer.State.Paused, TrackPlayer.State.None, TrackPlayer.State.Ready].includes(playbackState)
);

export const selectPlayerIsIdle = createSelector(
  [selectPlayerPlaybackState],
  playbackState => [TrackPlayer.State.None, TrackPlayer.State.Ready].includes(playbackState)
);

export const selectPlayerIsLoading = createSelector(
  [selectPlayerIsPlaying, selectPlayerIsStopped],
  (playerIsPlaying, playerIsStopped) => !playerIsPlaying && !playerIsStopped
);

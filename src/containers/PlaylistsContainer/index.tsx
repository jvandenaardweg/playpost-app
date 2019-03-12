import React from 'react';
import { FlatList, NetInfo } from 'react-native';
import { connect } from 'react-redux';
import RNRestart from 'react-native-restart';

import { UserState } from '../../reducers/user';
import { getPlaylists } from '../../reducers/playlists';
import { setTrack, PlayerState, PlaybackStatus, createAudiofile } from '../../reducers/player';

import { AppleStyleSwipeableRow } from '../../components/AppleStyleSwipeableRow';
import { CenterLoadingIndicator } from '../../components/CenterLoadingIndicator';
import { EmptyState } from '../../components/EmptyState';
import { ArticleContainer } from '../../components/Article/ArticleContainer';

import { getDefaultPlaylistArticles } from '../../selectors/playlists';
import { AuthState } from '../../reducers/auth';
import { Track } from 'react-native-track-player';

// import { GmailStyleSwipeableRow } from '@/components/GmailStyleSwipeableRow';

interface State {
  isLoading: boolean;
  isRefreshing: boolean;
  isConnected: boolean;
}

interface Props {
  auth: AuthState;
  user: UserState;
  articles: Api.Article[];
  playbackState: PlaybackStatus;
  setTrack: any; // TODO: change any
  track: Track;
  getPlaylists(): void;
  createAudiofile(articleId: string): void;
}

class ArticlesContainerComponent extends React.PureComponent<Props, State> {
  state = {
    isLoading: true,
    isRefreshing: false,
    isConnected: true
  };

  async componentWillMount() {
    const { isLoading } = this.state;

    const isConnected = await NetInfo.isConnected.fetch();

    if (isConnected) {
      console.log('Fetching playlists for the first time...');
      this.fetchPlaylists();
    } else {
      console.log('There is not active internet connection, so we cannot get the playlist.');
      if (isLoading) return this.setState({ isLoading: false, isConnected: false });
    }
  }

  async fetchPlaylists() {
    await this.props.getPlaylists();
    this.setState({ isLoading: false, isRefreshing: false });
  }

  handleOnRefresh() {
    this.setState({ isRefreshing: true }, () => this.fetchPlaylists());
  }

  render() {
    const { setTrack, track, playbackState, createAudiofile } = this.props;

    const { isLoading, isRefreshing, isConnected } = this.state;
    const { articles } = this.props;

    // Initial loading indicator
    if (isLoading) return <CenterLoadingIndicator />;

    if (!isConnected) {
      return <EmptyState title="No internet" description="There's no active internet connection, so we cannot display your playlist." actionButtonLabel="Try again" actionButtonOnPress={() => RNRestart.Restart()} />;
    }

    // Empty state
    // TODO: should hide empty state automatically when a playlist is filled with items externally
    if (!isLoading && !isRefreshing && !articles.length) {
      return <EmptyState title="Nothing in your playlist, yet" description="You can add articles by using the share icon in every app on your phone." />;
    }



    return (
      <FlatList
        refreshing={isRefreshing}
        onRefresh={() => this.handleOnRefresh()}
        data={articles}
        extraData={playbackState}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <AppleStyleSwipeableRow>
            <ArticleContainer
              article={item}
              setTrack={setTrack}
              createAudiofile={createAudiofile}
              track={track}
              playbackState={playbackState}
              seperated
            />
          </AppleStyleSwipeableRow>
        )}
      />
    );
  }
}

const mapStateToProps = (state: { player: PlayerState, auth: AuthState, user: UserState}) => ({
  track: state.player.track,
  playbackState: state.player.playbackState,
  auth: state.auth,
  user: state.user,
  articles: getDefaultPlaylistArticles(state)
});

const mapDispatchToProps = {
  setTrack,
  getPlaylists,
  createAudiofile
};

export const PlaylistsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticlesContainerComponent)

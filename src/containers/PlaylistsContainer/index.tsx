import React from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';

import { getMePlaylists, MeState } from '../../reducers/me';
import { getAudioByArticleUrl, setTrack, PlayerState } from '../../reducers/player';

import { AppleStyleSwipeableRow } from '../../components/AppleStyleSwipeableRow';
import { CenterLoadingIndicator } from '../../components/CenterLoadingIndicator';
import { EmptyState } from '../../components/EmptyState';
import { ArticleContainer } from '../../components/Article/ArticleContainer';

import { getDefaultPlaylistArticles } from '../../selectors/me';
import { AuthState } from '../../reducers/auth';

// import { GmailStyleSwipeableRow } from '@/components/GmailStyleSwipeableRow';

interface State {
  isLoading: boolean
  isRefreshing: boolean
}

interface Props {
  auth: AuthState
  me: MeState
  articles: Api.Article[]
  playbackStatus: any
  getAudioByArticleUrl: any
  setTrack: any
  track: any
  getMePlaylists(token: string): void
}

class ArticlesContainerComponent extends React.PureComponent<Props, State> {
  state = {
    isLoading: true,
    isRefreshing: false
  };

  async componentWillMount() {
    console.log('Fetching playlists for the first time...');
    this.fetchPlaylists();
  }

  async fetchPlaylists() {
    const { token } = this.props.auth;
    if (token) {
      await this.props.getMePlaylists(token);
      this.setState({ isLoading: false, isRefreshing: false });
    }
  }

  handleOnRefresh() {
    this.setState({ isRefreshing: true }, () => this.fetchPlaylists());
  }

  render() {
    const {
      getAudioByArticleUrl, setTrack, track, playbackStatus
    } = this.props;

    const { isLoading, isRefreshing } = this.state;
    const { articles } = this.props;

    // Initial loading indicator
    if (isLoading) return <CenterLoadingIndicator />;

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
        extraData={playbackStatus}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <AppleStyleSwipeableRow>
            <ArticleContainer
              article={item}
              getAudioByArticleUrl={getAudioByArticleUrl}
              setTrack={setTrack}
              playingTrack={track}
              playbackStatus={playbackStatus}
              seperated
            />
          </AppleStyleSwipeableRow>
        )}
      />
    );
  }
}

const mapStateToProps = (state: { player: PlayerState, auth: AuthState, me: MeState}) => ({
  track: state.player.track,
  playbackStatus: state.player.playbackStatus,
  auth: state.auth,
  me: state.me,
  articles: getDefaultPlaylistArticles(state)
});

const mapDispatchToProps = {
  getAudioByArticleUrl,
  setTrack,
  getMePlaylists
};

export const PlaylistsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticlesContainerComponent);

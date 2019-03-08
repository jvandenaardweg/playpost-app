import * as React from 'React';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';

import { getUserPlaylists, UserState } from '../../reducers/user';
import { getAudioByArticleUrl, setTrack, PlayerState } from '../../reducers/player';

import { AppleStyleSwipeableRow } from '../../components/AppleStyleSwipeableRow';
import { CenterLoadingIndicator } from '../../components/CenterLoadingIndicator';
import { EmptyState } from '../../components/EmptyState';
import { ArticleContainer } from '../../components/Article/ArticleContainer';

import { getDefaultPlaylistArticles } from '../../selectors/user';
import { AuthState } from '../../reducers/auth';

// import { GmailStyleSwipeableRow } from '@/components/GmailStyleSwipeableRow';

interface State {
  isLoading: boolean
  isRefreshing: boolean
}

interface Props {
  auth: AuthState
  user: UserState
  articles: Api.Article[]
  playbackStatus: any
  getAudioByArticleUrl: any
  setTrack: any
  track: any
  getUserPlaylists(token: string): void
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
      await this.props.getUserPlaylists(token);
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

const mapStateToProps = (state: { player: PlayerState, auth: AuthState, user: UserState}) => ({
  track: state.player.track,
  playbackStatus: state.player.playbackStatus,
  auth: state.auth,
  user: state.user,
  articles: getDefaultPlaylistArticles(state)
});

const mapDispatchToProps = {
  getAudioByArticleUrl,
  setTrack,
  getUserPlaylists
};

export const PlaylistsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticlesContainerComponent)

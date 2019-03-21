import React from 'react';
import { FlatList, Alert, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import RNRestart from 'react-native-restart';

import { CenterLoadingIndicator } from '../../components/CenterLoadingIndicator';
import { EmptyState } from '../../components/EmptyState';
import { ArticleContainer } from '../../components/Article/ArticleContainer';
import { NetworkContext } from '../../contexts/NetworkProvider';

import { getPlaylists } from '../../reducers/playlists';

import { getDefaultPlaylistArticles, getDefaultPlaylist } from '../../selectors/playlists';

import isEqual from 'react-fast-compare';
import { RootState } from '../../reducers';

// import { GmailStyleSwipeableRow } from '../../components/SwipeableRow/GmailStyleSwipeableRow';

interface State {
  isLoading: boolean;
  isRefreshing: boolean;
  errorMessage: string;
  showHelpVideo: boolean;
}

interface Props {
  articles: Api.Article[];
  defaultPlaylist: Api.Playlist | null;
  getPlaylists(): void;
}

class ArticlesContainerComponent extends React.Component<Props, State> {
  state = {
    isLoading: true, // Show loading upon mount, because we fetch the playlists of the user
    isRefreshing: false,
    errorMessage: '',
    showHelpVideo: false
  };

  static contextType = NetworkContext;

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    // If there's a state change inside the component, always update it
    if (!isEqual(this.state, nextState)) {
      return true;
    }

    // Only update this component when we have new playlist items
    if (!isEqual(this.props, nextProps)) {
      return true;
    }

    return false;
  }

  async componentDidMount() {
    const { isConnected } = this.context;

    this.showOrHideHelpVideo();

    if (isConnected) {
      this.fetchPlaylists();
    }
  }

  async showOrHideHelpVideo() {
    const showHelpVideo = await AsyncStorage.getItem('showHelpVideo');

    if (showHelpVideo) this.setState({ showHelpVideo: true });
  }

  async fetchPlaylists() {
    const { articles } = this.props;
    const { errorMessage } = this.state;

    try {
      // Get the user's playlist
      await this.props.getPlaylists();

      // Cleanup the error message if it's there
      if (errorMessage) return this.setState({ errorMessage: '' });
    } catch (err) {
      const customErrorMessage = 'There was an error while getting your playlist.';

      // If we don't have articles we show an empty error state
      if (!articles || !articles.length) {
        return this.setState({ errorMessage: customErrorMessage });
      }

      // If we have articles in the playlist, we just show an alert
      return this.showErrorAlert(customErrorMessage);
    } finally {
      return this.setState({ isLoading: false, isRefreshing: false });
    }
  }

  showErrorAlert(errorMessage: string) {
    return Alert.alert(
      'Oops!',
      errorMessage,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Try again',
          onPress: () => this.handleOnRefresh(),
        },
      ],
      { cancelable: true }
    );
  }

  get hasArticles() {
    const { articles } = this.props;
    return (articles && articles.length);
  }

  handleOnRefresh() {
    // If we don't have any articles, we show the general centered loading indicator
    const isLoading = !this.hasArticles;

    this.setState({ isLoading, isRefreshing: true }, () => this.fetchPlaylists());
  }

  handleOnHideVideo = async () => {
    await AsyncStorage.removeItem('showHelpVideo');
    this.setState({ showHelpVideo: false });
  }

  handleOnShowVideo = async () => {
    await AsyncStorage.setItem('showHelpVideo', 'true');
    this.setState({ showHelpVideo: true });
  }

  render() {
    // const { setTrack, track, playbackState, createAudiofile, articles } = this.props;
    const { articles, defaultPlaylist } = this.props;
    const { isLoading, isRefreshing, errorMessage, showHelpVideo } = this.state;
    const { isConnected } = this.context;

    // Initial loading indicator
    if (isLoading) return <CenterLoadingIndicator />;

    // If there's an error, and we don't have playlist items yet
    if (errorMessage && !this.hasArticles) return <EmptyState title="Error" description={errorMessage} actionButtonLabel="Try again" actionButtonOnPress={() => this.handleOnRefresh()} />;

    // Warning to the user there's no internet connection
    if (!isConnected && !this.hasArticles) {
      return <EmptyState title="No internet" description="There's no active internet connection, so we cannot display your playlist." actionButtonLabel="Try again" actionButtonOnPress={() => RNRestart.Restart()} />;
    }

    // Empty state
    if (!isLoading && !isRefreshing && !this.hasArticles) {
      if (showHelpVideo) {
        return (
          <EmptyState
            title="Nothing in your playlist, yet"
            description="Easily add articles to your playlist by using the share icon in every app on your phone:"
            localVideo={require('../../assets/video/help/enabling-sharing/enable-sharing-square.m4v')}
            actionButtonLabel="Hide instructions"
            actionButtonOnPress={() => this.handleOnHideVideo()}
          />
        );
      }

      return (
        <EmptyState
          title="Nothing in your playlist, yet"
          description="Easily add articles to your playlist by using the share icon in every app on your phone."
          actionButtonLabel="Show instructions"
            actionButtonOnPress={() => this.handleOnShowVideo()}
        />
      );

    }

    return (
      <FlatList
        refreshing={isRefreshing}
        onRefresh={() => this.handleOnRefresh()}
        data={articles}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ArticleContainer
            article={item}
            playlistId={defaultPlaylist && defaultPlaylist.id}
            seperated
          />
        )}
      />
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  defaultPlaylist: getDefaultPlaylist(state),
  articles: getDefaultPlaylistArticles(state)
});

const mapDispatchToProps = {
  getPlaylists
};

export const PlaylistsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticlesContainerComponent);

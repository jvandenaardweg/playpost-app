import React from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import DraggableFlatList from 'react-native-draggable-flatlist'

import { CenterLoadingIndicator } from '../../components/CenterLoadingIndicator';
import { EmptyState } from '../../components/EmptyState';
import { ArticleContainer } from '../../components/Article/ArticleContainer';
import { NetworkContext } from '../../contexts/NetworkProvider';

import { getPlaylist, reOrderPlaylistItem } from '../../reducers/playlist';
import { getVoices } from '../../reducers/voices';

import { getNewPlaylistItems, getArchivedPlaylistItems, getFavoritedPlaylistItems } from '../../selectors/playlist';

import isEqual from 'react-fast-compare';
import { RootState } from '../../reducers';

import { getDownloadedAudiofiles } from '../../selectors/audiofiles';
import { ArticleSeperator } from '../Article/ArticleSeperator';

interface State {
  isLoading: boolean;
  isRefreshing: boolean;
  isReOrdering: boolean;
  errorMessage: string;
  showHelpVideo: boolean;
  playlistItems: Api.PlaylistItem[];
}

interface IProps {
  isArchiveScreen?: boolean;
  isFavoriteScreen?: boolean;
}

type Props = IProps & StateProps & DispatchProps;

class ArticlesContainerComponent extends React.Component<Props, State> {
  state = {
    isLoading: false, // Show loading upon mount, because we fetch the playlist of the user
    isRefreshing: false,
    isReOrdering: false,
    errorMessage: '',
    showHelpVideo: false,
    playlistItems: []
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

  componentDidMount() {
    const { isConnected } = this.context;
    const { isArchiveScreen, isFavoriteScreen } = this.props;

    this.showOrHideHelpVideo();

    // When in Archive or Favorite screen, we assume we already have all the required data
    // TODO: figure out if this works
    if (isArchiveScreen || isFavoriteScreen) return;

    if (isConnected && !this.hasPlaylistItems) {
      this.setState({ isLoading: true }, () => this.fetchPlaylist());
    } else {
      // Just fetch the playlist in the background, so we always get an up-to-date playlist upon launch
      this.fetchPlaylist();
      this.fetchVoices();
    }

    // Wait a little longer, then hide the splash screen.
    // So we don't have a "black" flash.
    setTimeout(() => SplashScreen.hide(), 100);
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    // Prevent state update when we are re-ordering
    if (state.isReOrdering) {
      return null;
    }

    let playlistItems = props.newPlaylistItems;

    if (props.isArchiveScreen && !isEqual(props.isArchiveScreen, state.playlistItems)) {
      playlistItems = props.archivedPlaylistItems;
    }

    if (props.isFavoriteScreen && !isEqual(props.isFavoriteScreen, state.playlistItems)) {
      playlistItems = props.favoritedPlaylistItems;
    }

    return {
      playlistItems
    };
  }

  async showOrHideHelpVideo() {
    const showHelpVideo = await AsyncStorage.getItem('@showHelpVideo');

    if (showHelpVideo) this.setState({ showHelpVideo: true });
  }

  async fetchVoices() {
    await this.props.getVoices();
  }

  async fetchPlaylist() {
    const { errorMessage, playlistItems } = this.state;
    const { isConnected } = this.context;

    try {
      // Get the user's playlist
      await this.props.getPlaylist();

      // Cleanup the error message if it's there
      if (errorMessage) return this.setState({ errorMessage: '' });
    } catch (err) {
      if (!isConnected) return; // Don't show an error when there's no internet connection.

      const customErrorMessage = 'There was an error while getting your playlist.';

      // If we don't have articles we show an empty error state
      if (!playlistItems || !playlistItems.length) {
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

  get hasPlaylistItems() {
    const { playlistItems } = this.state;
    return (playlistItems && playlistItems.length);
  }

  handleOnRefresh = () => {
    // If we don't have any articles, we show the general centered loading indicator
    const isLoading = !this.hasPlaylistItems;

    this.setState({ isLoading, isRefreshing: true }, () => this.fetchPlaylist());
  }

  handleOnHideVideo = async () => {
    await AsyncStorage.removeItem('@showHelpVideo');
    this.setState({ showHelpVideo: false });
  }

  handleOnShowVideo = async () => {
    await AsyncStorage.setItem('@showHelpVideo', 'true');
    this.setState({ showHelpVideo: true });
  }

  isDownloaded(article: Api.Article) {
    const { downloadedAudiofiles } = this.props;

    if (!article.audiofiles.length) return false;

    const downloadedAudiofileIds = downloadedAudiofiles.map(audiofile => audiofile.id);

    return downloadedAudiofileIds.includes(article.audiofiles[0].id);
  }

  renderEmptyComponent = () => {
    const { isLoading, isRefreshing, showHelpVideo, errorMessage } = this.state;
    const { isArchiveScreen, isFavoriteScreen } = this.props;
    const { isConnected } = this.context;

    if (isLoading) return <CenterLoadingIndicator />;

    // If there's an error, and we don't have playlist items yet
    if (errorMessage && !this.hasPlaylistItems) return <EmptyState title="Error" description={errorMessage} actionButtonLabel="Try again" actionButtonOnPress={() => this.handleOnRefresh()} />;

    if (isArchiveScreen) {
      return <EmptyState title="Your archived articles" description="Articles you've already listened will be shown here in your archive, for easy future reference." />;
    }

    if (isFavoriteScreen) {
      return <EmptyState title="Your favorite articles" description="Articles you really liked can be saved here, away from your daily playlist." />;
    }

    // Warning to the user there's no internet connection
    if (!isConnected && !this.hasPlaylistItems) {
      return <EmptyState title="No internet" description="There's no active internet connection, so we cannot display your playlist." actionButtonLabel="Try again" actionButtonOnPress={() => this.handleOnRefresh()} />;
    }

    if (!isLoading && !isRefreshing && !this.hasPlaylistItems) {
      if (showHelpVideo) {
        return (
          <EmptyState
            localVideo={require('../../assets/video/help/enabling-sharing/enable-sharing-square-v2.m4v')}
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

    return null;
  }

  handleOnMoveEnd = async ({ data, to, from, row }: { data: Api.PlaylistItem[] | null, to: number, from: number, row: Api.PlaylistItem }) => {
    const articleId = row.article.id;
    const newOrder = to;
    const newPlaylistItemsOrder: Api.PlaylistItem[] | null = data;

    if (!newPlaylistItemsOrder) return;

    return this.setState({ playlistItems: newPlaylistItemsOrder, isReOrdering: true }, async () => {
      try {
        // Call API to set new order in the database
        await this.props.reOrderPlaylistItem(articleId, newOrder);

        // Get the newly ordered playlist
        await this.props.getPlaylist();
      } catch (err) {
        Alert.alert('Oops!', 'An error happened while re-ordering your playlist. Please try again.');
      } finally {
        this.setState({ isReOrdering: false });
      }
    });
  }

  renderSeperatorComponent = () => {
    return (<ArticleSeperator />);
  }

  renderItem = (
    { item, index, move, moveEnd, isActive }:
    { item: Api.PlaylistItem, index: number, move(): void, moveEnd(): void, isActive: boolean}
  ) => {

    // Only allow re-ordering of items when in the playlist screen
    const allowMove = !this.props.isArchiveScreen || !this.props.isFavoriteScreen;

    return (
      <ArticleContainer
        isMoving={(allowMove) ? isActive : false}
        isFavorited={!!item.favoritedAt}
        isArchived={!!item.archivedAt}
        playlistItem={item}
        article={item.article}
        isDownloaded={this.isDownloaded(item.article)}
        onLongPress={(allowMove) ? move : () => {}}
        onPressOut={(allowMove) ? moveEnd : () => {}}
      />
    );
  }

  render() {
    const { isRefreshing, playlistItems } = this.state;

    return (
      <DraggableFlatList
        scrollEnabled={!!this.hasPlaylistItems}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshing={isRefreshing}
        onRefresh={this.handleOnRefresh}
        data={playlistItems}
        keyExtractor={(item: Api.PlaylistItem) => item.id.toString()}
        ItemSeparatorComponent={this.renderSeperatorComponent}
        ListEmptyComponent={this.renderEmptyComponent}
        onMoveEnd={this.handleOnMoveEnd}
        scrollPercent={5}
        renderItem={this.renderItem}
      />
    );
  }
}

interface StateProps {
  newPlaylistItems: ReturnType<typeof getNewPlaylistItems>;
  archivedPlaylistItems: ReturnType<typeof getArchivedPlaylistItems>;
  favoritedPlaylistItems: ReturnType<typeof getFavoritedPlaylistItems>;
  downloadedAudiofiles: ReturnType<typeof getDownloadedAudiofiles>;
}

interface DispatchProps {
  getPlaylist: typeof getPlaylist;
  getVoices: typeof getVoices;
  reOrderPlaylistItem: typeof reOrderPlaylistItem;
}

const mapStateToProps = (state: RootState) => ({
  newPlaylistItems: getNewPlaylistItems(state),
  archivedPlaylistItems: getArchivedPlaylistItems(state),
  favoritedPlaylistItems: getFavoritedPlaylistItems(state),
  downloadedAudiofiles: getDownloadedAudiofiles(state)
});

const mapDispatchToProps = {
  getPlaylist,
  getVoices,
  reOrderPlaylistItem
};

export const PlaylistsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticlesContainerComponent);

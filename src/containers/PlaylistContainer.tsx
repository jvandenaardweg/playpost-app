import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { Alert, FlatList, InteractionManager, Platform } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
// import DraggableFlatList from 'react-native-draggable-flatlist';

import { CenterLoadingIndicator } from '../components/CenterLoadingIndicator';
import { EmptyState } from '../components/EmptyState';
import { NetworkContext } from '../contexts/NetworkProvider';
import { ArticleContainer } from './ArticleContainer';

import { getPlaylist, reOrderPlaylistItem } from '../reducers/playlist';

import { selectArchivedPlaylistItems, selectFavoritedPlaylistItems, selectNewPlaylistItems } from '../selectors/playlist';

import isEqual from 'react-fast-compare';
import { RootState } from '../reducers';

import { ListSeperator } from '../components/ListSeperator';
import { ALERT_TITLE_ERROR } from '../constants/messages';
import { selectDownloadedAudiofiles } from '../selectors/audiofiles';

interface State {
  isLoading: boolean;
  isRefreshing: boolean;
  isReOrdering: boolean;
  showHelpVideo: boolean;
  playlistItems: Api.PlaylistItem[];
  osVersion: string;
}

interface IProps {
  isArchiveScreen?: boolean;
  isFavoriteScreen?: boolean;
}

type Props = IProps & StateProps & DispatchProps;

class PlaylistContainerComponent extends React.Component<Props, State> {

  get hasPlaylistItems() {
    const { playlistItems } = this.state;
    return playlistItems && playlistItems.length;
  }

  static contextType = NetworkContext;

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
  state = {
    isLoading: false, // Show loading upon mount, because we fetch the playlist of the user
    isRefreshing: false,
    isReOrdering: false,
    showHelpVideo: false,
    playlistItems: [],
    osVersion: ''
  };

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

    InteractionManager.runAfterInteractions(async () => {

      const systemVersion = await DeviceInfo.getSystemVersion()

      this.setState({ osVersion: systemVersion });

      this.showOrHideHelpVideo();

      // If we mount this component, and we don't have any playlist items, fetch them
      if (isConnected) {
        if (!this.hasPlaylistItems) {
          this.setState({ isLoading: true }, () => {
            this.fetchPlaylist();
          });
        }
      }

      SplashScreen.hide();
    });

  }

  async showOrHideHelpVideo() {
    const showHelpVideo = await AsyncStorage.getItem('@showHelpVideo');

    if (showHelpVideo) { this.setState({ showHelpVideo: true }); }
  }

  async fetchPlaylist() {
    const { isConnected } = this.context;

    try {
      // Get the user's playlist
      const result = await this.props.getPlaylist();
      return result;
    } catch (err) {
      if (!isConnected) { return; } // Don't show an error when there's no internet connection.

      const customErrorMessage = 'There was an error while getting your playlist.';

      // Error message is handled by APIErrorAlertContainer

      return customErrorMessage;
    } finally {
      this.setState({ isLoading: false, isRefreshing: false });
    }
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

  get requireInstructionsVideo(): NodeRequire {
    const { osVersion } = this.state;

    // Show older help video on older iOS versions
    if (Platform.OS === 'ios' && (osVersion.startsWith('12') || osVersion.startsWith('11'))) {
      return require('../assets/video/help/enabling-sharing/ios-ios12.m4v');
    }

    // Show a different video on Android
    if (Platform.OS === 'android') {
      return require('../assets/video/help/enabling-sharing/android.m4v');
    }

    // Fallback to iOS 13 and newer
    return require('../assets/video/help/enabling-sharing/ios-ios13.m4v');
  }

  renderEmptyComponent = () => {
    const { isLoading, isRefreshing, showHelpVideo, osVersion } = this.state;
    const { isArchiveScreen, isFavoriteScreen } = this.props;
    const { isConnected } = this.context;

    if (isLoading || !osVersion) { return <CenterLoadingIndicator />; }

    if (isArchiveScreen) {
      return (
        <EmptyState
          title="Your archived articles"
          description={[
            "Articles you've already listened will be shown here in your archive, for easy future reference.",
            'You can archive an article by swiping from right to left on an article.'
          ]}
        />
      );
    }

    if (isFavoriteScreen) {
      return (
        <EmptyState
          title="Your favorite articles"
          description={[
            'Articles you really liked can be saved here, away from your daily playlist.',
            'You can favorite an article by swiping from right to left on an article.'
          ]}
        />
      );
    }

    // Warning to the user there's no internet connection
    if (!isConnected && !this.hasPlaylistItems) {
      return (
        <EmptyState
          title="No internet"
          description={["There's no active internet connection, so we cannot display your playlist."]}
          actionButtonLabel="Try again"
          actionButtonOnPress={() => this.handleOnRefresh()}
        />
      );
    }

    if (!isLoading && !isRefreshing && !this.hasPlaylistItems) {
      if (showHelpVideo) {
        return (
          <EmptyState
            localVideo={this.requireInstructionsVideo}
            actionButtonLabel="Hide instructions"
            actionButtonOnPress={() => this.handleOnHideVideo()}
          />
        );
      }

      return (
        <EmptyState
          title="Nothing in your playlist... yet!"
          description={['Easily add articles to your playlist by using the share icon in every app on your phone.']}
          actionButtonLabel="Show instructions"
          actionButtonOnPress={() => this.handleOnShowVideo()}
        />
      );
    }

    return null;
  }

  handleOnMoveEnd = async ({ data, to, from, row }: { data: Api.PlaylistItem[] | null; to: number; from: number; row: Api.PlaylistItem }) => {
    const articleId = row.article.id;
    const newOrder = to;
    const newPlaylistItemsOrder: Api.PlaylistItem[] | null = data;

    if (!newPlaylistItemsOrder) { return; }

    return this.setState({ playlistItems: newPlaylistItemsOrder, isReOrdering: true }, async () => {
      try {
        // Call API to set new order in the database
        await this.props.reOrderPlaylistItem(articleId, newOrder);

        // Get the newly ordered playlist
        await this.props.getPlaylist();
      } catch (err) {
        Alert.alert(ALERT_TITLE_ERROR, 'An error happened while re-ordering your playlist. Please try again.');
      } finally {
        this.setState({ isReOrdering: false });
      }
    });
  }

  renderSeperatorComponent = () => {
    return <ListSeperator />;
  }

  renderItem = ({ item, index }: { item: Api.PlaylistItem; index: number }) => {
    // Only allow re-ordering of items when in the playlist screen
    // const allowMove = !this.props.isArchiveScreen || !this.props.isFavoriteScreen;

    return (
      <ArticleContainer
        key={item.id}
        // isMoving={(allowMove) ? isActive : false}
        isMoving={false}
        isFavorited={!!item.favoritedAt}
        isArchived={!!item.archivedAt}
        playlistItem={item}
        article={item.article}
        // onLongPress={(allowMove) ? move : () => {}}
        // onLongPress={() => {}}
        // onPressOut={(allowMove) ? moveEnd : () => {}}
        // onPressOut={() => {}}
      />
    );
  }

  render() {
    const { isRefreshing, playlistItems } = this.state;

    return (
      <FlatList
        scrollEnabled={!!this.hasPlaylistItems}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshing={isRefreshing}
        onRefresh={this.handleOnRefresh}
        data={playlistItems}
        keyExtractor={(item: Api.PlaylistItem) => item.id.toString()}
        ItemSeparatorComponent={this.renderSeperatorComponent}
        ListEmptyComponent={this.renderEmptyComponent}
        initialNumToRender={7}
        // onMoveEnd={this.handleOnMoveEnd}
        // scrollPercent={5}
        renderItem={this.renderItem}
        removeClippedSubviews={true}
      />
      // DraggableFlatList temporary disabled
      // There seems to be a problem with the list dissapearing when archiving/favoriting
      //
      // <DraggableFlatList
      //   scrollEnabled={!!this.hasPlaylistItems}
      //   contentContainerStyle={{ flexGrow: 1 }}
      //   refreshing={isRefreshing}
      //   onRefresh={this.handleOnRefresh}
      //   data={playlistItems}
      //   keyExtractor={(item: Api.PlaylistItem) => item.id.toString()}
      //   ItemSeparatorComponent={this.renderSeperatorComponent}
      //   ListEmptyComponent={this.renderEmptyComponent}
      //   onMoveEnd={this.handleOnMoveEnd}
      //   scrollPercent={5}
      //   renderItem={this.renderItem}
      //   removeClippedSubviews // unmount components that are off of the window
      // />
    );
  }
}

interface StateProps {
  newPlaylistItems: ReturnType<typeof selectNewPlaylistItems>;
  archivedPlaylistItems: ReturnType<typeof selectArchivedPlaylistItems>;
  favoritedPlaylistItems: ReturnType<typeof selectFavoritedPlaylistItems>;
  downloadedAudiofiles: ReturnType<typeof selectDownloadedAudiofiles>;
}

interface DispatchProps {
  getPlaylist: typeof getPlaylist;
  reOrderPlaylistItem: typeof reOrderPlaylistItem;
}

const mapStateToProps = (state: RootState) => ({
  newPlaylistItems: selectNewPlaylistItems(state),
  archivedPlaylistItems: selectArchivedPlaylistItems(state),
  favoritedPlaylistItems: selectFavoritedPlaylistItems(state),
  downloadedAudiofiles: selectDownloadedAudiofiles(state)
});

const mapDispatchToProps = {
  getPlaylist,
  reOrderPlaylistItem
};

export const PlaylistContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaylistContainerComponent);

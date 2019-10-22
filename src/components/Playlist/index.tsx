import React, { useContext, useEffect, useState } from 'react';
import { FlatList, LayoutAnimation, Platform, RefreshControl, Text } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import isEqual from 'react-fast-compare';
import DeviceInfo from 'react-native-device-info';

import { NetworkContext } from '../../contexts/NetworkProvider';
import { UserThemeContext } from '../../contexts/UserThemeProvider';

import { CenterLoadingIndicator } from '../../components/CenterLoadingIndicator';
import { EmptyState } from '../../components/EmptyState';
import { ListSeperator } from '../../components/ListSeperator';

import { ArticleContainer } from '../../containers/ArticleContainer';
import { DispatchProps, StateProps } from '../../containers/PlaylistContainer';

import colors from '../../constants/colors';

import { UserTheme } from '../../reducers/user';

interface State {
  isLoading: boolean;
  isRefreshing: boolean;
  showHelpVideo: boolean;
  playlistItems: Api.PlaylistItem[];
}

interface IProps {
  isArchiveScreen?: boolean;
  isFavoriteScreen?: boolean;
}

type Props = IProps & StateProps & DispatchProps;

export const Playlist: React.FC<Props> = React.memo((props) => {
  const { isConnected } = useContext(NetworkContext)
  const { theme } = useContext(UserThemeContext)

  const [isLoading, setIsLoading] = useState<State['isLoading']>(true)
  const [isRefreshing, setIsRefreshing] = useState<State['isRefreshing']>(false)
  const [showHelpVideo, setShowHelpVideo] = useState<State['showHelpVideo']>(false)
  const [playlistItems, setPlaylistItems] = useState<State['playlistItems']>([])

  // componentDidMount
  useEffect(() => {
    showOrHideHelpVideo()
  }, [])

  // Handle a change in playlist items
  useEffect(() => {
    if (!playlistItems.length) {
      setIsLoading(true)
      fetchPlaylist()
    }

    if (props.isArchiveScreen && !isEqual(props.isArchiveScreen, playlistItems)) {
      // When a new item is added or deleted, animate it
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      return setPlaylistItems(props.archivedPlaylistItems)
    }

    if (props.isFavoriteScreen && !isEqual(props.isFavoriteScreen, playlistItems)) {
      // When a new item is added or deleted, animate it
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      return setPlaylistItems(props.favoritedPlaylistItems)
    }

    if (!props.isFavoriteScreen && !props.isArchiveScreen && !isEqual(props.newPlaylistItems, playlistItems)) {
      // When a new item is added or deleted, animate it
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      return setPlaylistItems(props.newPlaylistItems)
    }

  }, [props.newPlaylistItems, props.isArchiveScreen, props.isFavoriteScreen, playlistItems])


  const renderEmptyComponent = () => {
    const osVersion = DeviceInfo.getSystemVersion();

    if (isLoading) {
      return <CenterLoadingIndicator />;
    }

    if (props.isArchiveScreen) {
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

    if (props.isFavoriteScreen) {
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
    if (!isConnected && !props.newPlaylistItems.length) {
      return (
        <EmptyState
          title="No internet"
          description={["There's no active internet connection, so we cannot display your playlist."]}
          actionButtonLabel="Try again"
          actionButtonOnPress={() => handleOnRefresh()}
        />
      );
    }

    if (!isLoading && !isRefreshing && !props.newPlaylistItems.length) {
      if (showHelpVideo) {
        return (
          <EmptyState
            localVideo={getRequireInstructionsVideo(osVersion)}
            actionButtonLabel="Hide instructions"
            actionButtonOnPress={() => handleOnHideVideo()}
          />
        );
      }

      return (
        <EmptyState
          title="Nothing in your playlist... yet!"
          description={['Easily add articles to your playlist by using the share icon in every app on your phone.']}
          actionButtonLabel="Show instructions"
          actionButtonOnPress={() => handleOnShowVideo()}
        />
      );
    }

    return null;
  }

  const renderSeperatorComponent = () => {
    return <ListSeperator />;
  }

  const handleOnRefresh = async () => {
    setIsLoading(true)
    setIsRefreshing(true)
    fetchPlaylist()
  }

  const fetchPlaylist = async () => {
    try {
      // Get the user's playlist
      const result = await props.getPlaylist();
      return result;
    } catch (err) {
      if (!isConnected) { return; } // Don't show an error when there's no internet connection.

      const customErrorMessage = 'There was an error while getting your playlist.';

      // Error message is handled by APIErrorAlertContainer

      return customErrorMessage;
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleOnHideVideo = async () => {
    await AsyncStorage.removeItem('@showHelpVideo');
    setShowHelpVideo(false);
  }

  const handleOnShowVideo = async () => {
    await AsyncStorage.setItem('@showHelpVideo', 'true');
    setShowHelpVideo(true);
  }

  const getRequireInstructionsVideo = (osVersion: string): NodeRequire => {
    // Show older help video on older iOS versions
    if (Platform.OS === 'ios' && (osVersion.startsWith('12') || osVersion.startsWith('11'))) {
      return require('../../assets/video/help/enabling-sharing/ios-ios12.m4v');
    }

    // Show a different video on Android
    if (Platform.OS === 'android') {
      return require('../../assets/video/help/enabling-sharing/android.m4v');
    }

    // Fallback to iOS 13 and newer
    return require('../../assets/video/help/enabling-sharing/ios-ios13.m4v');
  }

  const showOrHideHelpVideo = async () => {
    const showHelpVideoFromStorage = await AsyncStorage.getItem('@showHelpVideo');

    if (showHelpVideoFromStorage) {
      setShowHelpVideo(true);
    }
  }

  return (
    <FlatList
      scrollEnabled={!!playlistItems.length}
      contentContainerStyle={{ flexGrow: 1 }}
      data={playlistItems.length ? playlistItems : null}
      keyExtractor={(item: Api.PlaylistItem) => item.id.toString()}
      ItemSeparatorComponent={renderSeperatorComponent}
      ListEmptyComponent={renderEmptyComponent}
      initialNumToRender={7}
      renderItem={({ item }: { item: Api.PlaylistItem; index: number }) => (
        <ArticleContainer
          key={item.id}
          isMoving={false}
          isFavorited={!!item.favoritedAt}
          isArchived={!!item.archivedAt}
          playlistItem={item}
          article={item.article}
        />
      )}
      indicatorStyle={theme === UserTheme.dark ? 'white' : 'black'}
      removeClippedSubviews={true}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleOnRefresh}
          tintColor={theme === UserTheme.dark ? colors.white : colors.gray100}
        />
      }
    />
  )
}, isEqual)

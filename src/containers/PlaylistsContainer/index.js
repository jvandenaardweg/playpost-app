import React from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getMePlaylists } from '@/reducers/me';
import { getAudioByArticleUrl, setTrack } from '@/reducers/player';

import { AppleStyleSwipeableRow } from '@/components/AppleStyleSwipeableRow';
import { CenterLoadingIndicator } from '@/components/CenterLoadingIndicator';
import { EmptyState } from '@/components/EmptyState';
import { ArticleContainer } from '@/components/Article/ArticleContainer';

import { getDefaultPlaylistArticles } from '@/selectors/me';

// import { GmailStyleSwipeableRow } from '@/components/GmailStyleSwipeableRow';


class ArticlesContainerComponent extends React.PureComponent {
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
    await this.props.getMePlaylists(token);
    this.setState({ isLoading: false, isRefreshing: false });
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

const mapStateToProps = (state) => ({
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

ArticlesContainerComponent.defaultProps = {
  track: {},
  playbackStatus: null
};

ArticlesContainerComponent.propTypes = {
  getAudioByArticleUrl: PropTypes.func.isRequired,
  setTrack: PropTypes.func.isRequired,
  track: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    artist: PropTypes.string,
    album: PropTypes.string
  }),
  playbackStatus: PropTypes.string
};

export const PlaylistsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticlesContainerComponent);

import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import validUrl from 'valid-url';

import { getPlaylists, addArticleToPlaylistByUrl, PlaylistsState } from '../../reducers/playlists';

import { getDefaultPlaylist } from '../../selectors/playlists';

import styles from './styles';
import { RootState } from '../../reducers';

interface State {
  isLoading: boolean;
  errorMessage: string;
}

interface Props {
  url: string;
  type: string;
  playlists: PlaylistsState;
  closeDelay?: number;
  defaultPlaylist: Api.Playlist | null;
  onPressClose(): void;
  onPressSave(): void;
  addArticleToPlaylistByUrl(articleUrl: string, playlistId: string): void;
  getPlaylists(): void;
}

export class ShareModalContainer extends React.PureComponent<Props, State> {
  state = {
    isLoading: true,
    errorMessage: ''
  };

  static defaultProps = {
    closeDelay: 2500
  };

  componentDidMount() {
    const { url } = this.props;

    if (!validUrl.isUri(url)) {
      return this.setState({ errorMessage: `Could not share this URL: ${url}`, isLoading: false });
    }

    this.fetchPlaylists();

  }

  fetchPlaylists = async () => {
    try {
      await this.props.getPlaylists();
      await this.addArticleToPlaylist();
    } catch (err) {
      console.log('Error during mount of ShareModal.', err);
      return this.setState({ isLoading: false });
    }
  }

  async componentDidUpdate(prevProps: Props) {
    const { error } = this.props.playlists;

    // When a new API error happens
    if (prevProps.playlists.error !== error) {
      this.setState({ errorMessage: error, isLoading: false });
    }
  }

  addArticleToPlaylist = async () => {
    const { closeDelay, url, defaultPlaylist } = this.props;

    if (!defaultPlaylist) return;

    try {
      await this.props.addArticleToPlaylistByUrl(url, defaultPlaylist.id);

      // Automatically close the modal after X seconds
      setTimeout(() => this.props.onPressClose(), closeDelay);
    } catch (err) {
      return console.log('Error during addArticleToPlaylist.', err);
    } finally {
      return this.setState({ isLoading: false });
    }
  }

  renderMessage = () => {
    const { isLoading, errorMessage } = this.state;

    if (isLoading) return null;

    // TODO: handle error messages
    // scenario: article could not be added (for example wrong language)
    // scenario: no internet
    // scenario: timeout
    if (errorMessage) {
      return (
        <Text style={{ color: 'red' }}>{errorMessage}</Text>
      );
    }

    return (
      <Text>Article is added to your default playlist!</Text>
    );
  }

  renderActivityIndicator = () => {
    const { isLoading } = this.state;

    if (!isLoading) return null;

    return <ActivityIndicator />;
  }

  render() {
    const { onPressClose } = this.props;

    return (
      <View style={styles.container}>
        <View>
          <View style={styles.articleContainer}>
            {this.renderActivityIndicator()}
            {this.renderMessage()}
          </View>
          <View style={styles.footer}>
            <Button title="Close" onPress={onPressClose} />
            {/* <Button title="Open app" onPress={onPressClose} /> */}
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  playlists: state.playlists,
  defaultPlaylist: getDefaultPlaylist(state)
});

const mapDispatchToProps = {
  addArticleToPlaylistByUrl,
  getPlaylists
};

export const ShareModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareModalContainer);

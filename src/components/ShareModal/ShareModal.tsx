import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

import { UserState, addArticleToPlaylistByUrl, getUserPlaylists } from '../../reducers/user';
import { AuthState } from '../../reducers/auth';

import { getDefaultPlaylist } from '../../selectors/user';

import styles from './styles';

interface State {
  isLoading: boolean;
  errorMessage: string | null;
}

interface Props {
  url: string;
  type: string;
  user: UserState;
  auth: AuthState;
  closeDelay?: number;
  defaultPlaylist: Api.Playlist;
  onPressClose(): void;
  onPressSave(): void;
  addArticleToPlaylistByUrl(articleUrl: string, playlistId: string): void;
  getUserPlaylists(): void;
}

export class ShareModalContainer extends React.PureComponent<Props, State> {
  state = {
    isLoading: true,
    errorMessage: null
  };

  static defaultProps = {
    closeDelay: 2500
  };

  async componentDidMount() {
    await this.props.getUserPlaylists();
  }

  async componentDidUpdate(prevProps: Props) {
    const { error } = this.props.user;
    const { url, defaultPlaylist } = this.props;

    // If we have a default playlist, add the article
    if (!prevProps.defaultPlaylist && defaultPlaylist) {
      const playlistId = defaultPlaylist.id;
      await this.addArticleToPlaylist(url, playlistId);
    }

    // When a new API error happens
    if (prevProps.user.error !== error) {
      this.setState({ errorMessage: error });
    }
  }

  addArticleToPlaylist = async (articleUrl: string, playlistId: string) => {
    const { closeDelay } = this.props;
    const { error } = this.props.user;

    try {
      await this.props.addArticleToPlaylistByUrl(articleUrl, playlistId);

      // Automatically close the modal after X seconds
      setTimeout(() => this.props.onPressClose(), closeDelay);
    } catch (err) {
      console.log('Error happned');
      // let errorMessage = 'We could not add this article to your playlist. Please try again.';
      // if (err.error.response && err.error.response.data && err.error.response.data.message) {
      //   errorMessage = err.error.response.data.message;
      // }
      // return this.setState({ errorMessage });
    } finally {
      return this.setState({ isLoading: false });
    }
  }

  renderMessage = () => {
    const { isLoading, errorMessage } = this.state;

    // TODO: handle error messages
    // scenario: article could not be added (for example wrong language)
    // scenario: no internet
    // scenario: timeout
    if (!isLoading && errorMessage) {
      return (
        <Text style={{ color: 'red' }}>{errorMessage}</Text>
      );
    }

    if (!isLoading) {
      return (
        <Text>Article is added to your default playlist!</Text>
      );
    }
  }

  renderActivityIndicator = () => {
    const { isLoading } = this.state;

    if (isLoading) return <ActivityIndicator />;
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

const mapStateToProps = (state: { auth: AuthState, user: UserState }) => ({
  auth: state.auth,
  user: state.user,
  defaultPlaylist: getDefaultPlaylist(state)
});

const mapDispatchToProps = {
  addArticleToPlaylistByUrl,
  getUserPlaylists
};

export const ShareModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareModalContainer);

import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

import { UserState, addArticleToPlaylistByUrl } from '../../reducers/user';
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
  onPressClose(): void;
  onPressSave(): void;
  addArticleToPlaylistByUrl(articleUrl: string, playlistId: string, token: string): void;
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
    const { url } = this.props;
    await this.addArticleToPlaylist(url);
  }

  componentDidUpdate(prevProps: Props) {
    const { error } = this.props.user;

    // When a new API error happens
    if (prevProps.user.error !== error) {
      this.setState({ errorMessage: error });
    }
  }

  addArticleToPlaylist = async (articleUrl: string) => {
    const { closeDelay } = this.props;
    const { error } = this.props.user;

    // const { token } = this.props.auth;
    // const playlistId = this.props.defaultPlaylist.id;

    // TODO: remove, Use test token for now
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBhZTdhZjNmLTk0ODItNDM0YS1hZjdhLWNmZGFmODM2NmJlYyIsImVtYWlsIjoiaW5mb0BhYXJkd2VnbWVkaWEubmwiLCJpYXQiOjE1NTIwNjA5MDV9.om_RGH1blkzet63xHTwldqbCgqxzNGiMBFrRKLvNY8c';
    const playlistId = '5287979b-ed50-45c9-bf66-104e524bf495';

    // if (!token) {
    //   return this.setState({ errorAction: 'login', errorMessage: 'You need to login first. Go to the app and login.' });
    // }

    // // TODO: get playlist

    // if (!playlistId) {
    //   return this.setState({ errorAction: 'playlist', errorMessage: 'We could not find your default playlist. Please make sure your account is still active. If this problem keeps coming back, contact us!' });
    // }

    try {
      await this.props.addArticleToPlaylistByUrl(articleUrl, playlistId, token);

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
  addArticleToPlaylistByUrl
};

export const ShareModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareModalContainer);

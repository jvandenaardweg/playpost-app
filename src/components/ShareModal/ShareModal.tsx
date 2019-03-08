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
}

interface Props {
  url: string;
  type: string;
  user: UserState;
  auth: AuthState;
  onPressClose(): void;
  onPressSave(): void;
  addArticleToPlaylistByUrl(articleUrl: string, playlistId: string, token: string): void;
}

export class ShareModalContainer extends React.PureComponent<Props, State> {
  state = {
    isLoading: true,
  };

  async componentDidMount() {
    const { url } = this.props;
    await this.addArticleToPlaylist(url);
  }

  addArticleToPlaylist = async (articleUrl: string) => {

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

    await this.props.addArticleToPlaylistByUrl(articleUrl, playlistId, token);

    this.setState({ isLoading: false }, () => {
      // Automatically close the modal
      setTimeout(() => this.props.onPressClose(), 2500);
    });
  }

  renderMessage = () => {
    const { isLoading } = this.state;

    // TODO: handle error messages
    // scenario: article already in playlist
    // scenario: article could not be added (for example wrong language)
    // scenario: no internet
    // scenario: timeout
    if (!isLoading) {
      return (
        <Text>Article is added to your playlist!</Text>
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

import React from 'react';
import { Animated, View, Modal, Alert } from 'react-native';
import { connect } from 'react-redux';
import ShareExtension from 'react-native-share-extension';

import { ShareModal } from '../../components/ShareModal';
import { ErrorModal } from '../../components/ErrorModal';

import { getDefaultPlaylist } from '../../selectors/me';
import { AuthState } from '../../reducers/auth';
import { MeState } from '../../reducers/me';

interface State {
  isOpen: boolean
  type: string
  value: string
  opacityAnim: Animated.Value
  errorMessage: string
  errorAction: string
}

interface Props {
  auth: AuthState
  defaultPlaylist: ApiPlaylist
}

export default class ShareContainer extends React.Component<Props, State> {
  state = {
    isOpen: true,
    type: '',
    value: '',
    opacityAnim: new Animated.Value(0),
    errorMessage: '',
    errorAction: ''
  }

  async componentDidMount() {
    try {
      // 1. Get the token from storage from the main app
      // 2. Get the default playlist
      // 3. Create an article if it does not exist yet. Get the article if it already exists
      // 4. Use the article ID to add it to the user's playlist

      const { opacityAnim } = this.state;
      const { defaultPlaylist, auth: { token } } = this.props;
      const playlistId = (defaultPlaylist && defaultPlaylist.id) ? defaultPlaylist.id : null;

      // Start fade in animation
      Animated.timing(
        opacityAnim,
        {
          toValue: 1,
          duration: 300,
        }
      ).start();

      if (!token) {
        return this.setState({ errorAction: 'login', errorMessage: 'You need to login first. Go to the app and login.' });
      }

      // // TODO: get playlist

      if (!playlistId) {
        return this.setState({ errorAction: 'playlist', errorMessage: 'We could not find your default playlist. Please make sure your account is still active. If this problem keeps coming back, contact us!' });
      }

      // Wait for the extension data
      const { type, value } = await ShareExtension.data();


      const articleUrl = value;

      console.log(`Should add URL "${articleUrl}" to playlist ID "${playlistId}".`);

      // TODO: create/return an articleId

      // TODO: connect that article id to the default playlist of the user

      // TODO: show success or fail message




      return this.setState({ type, value });
    } catch (e) {
      /* eslint-disable no-alert */
      // alert('An error occurred. Please try again.');
      /* eslint-disable no-console */
      return console.log('errrr', e);
    }
  }

  onClose = () => ShareExtension.close()

  closing = () => {
    const { opacityAnim } = this.state;

    this.setState({ isOpen: false });

    Animated.timing(
      opacityAnim,
      {
        toValue: 0,
        duration: 200,
      }
    ).start();
  }

  openUrl = async (url: string) => {
    try {
      // const supported = await Linking.canOpenURL(url);

      // if (!supported) return console.log(`Can't handle url: ${url}`);

      return ShareExtension.openURL(url);
    } catch (err) {
      return console.error('An error occurred while opening the url', err);
    }
  }

  render() {
    const {
      opacityAnim, isOpen, value, type, errorMessage, errorAction
    } = this.state;

    return (
      <Animated.View style={{
        flex: 1,
        opacity: opacityAnim,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)'
      }}
      >
        <Modal
          animationType="slide"
          presentationStyle="overFullScreen"
          supportedOrientations={['portrait', 'landscape']}
          transparent
          visible={isOpen}
          onDismiss={this.onClose}
        >
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24
          }}
          >
            {errorMessage && <ErrorModal message={errorMessage} action={errorAction} onPressAction={this.openUrl} />}

            {!errorMessage && type && value && (
              <ShareModal
                type={type}
                url={value}
                onPressSave={this.closing}
                onPressCancel={this.closing}
              />
            )}
          </View>
        </Modal>
      </Animated.View>
    );
  }
}

const mapStateToProps = (state: { auth: AuthState, me: MeState}) => ({
  auth: state.auth,
  me: state.me,
  defaultPlaylist: getDefaultPlaylist(state)
});

const mapDispatchToProps = {};

export const Share = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareContainer);

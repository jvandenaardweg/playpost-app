import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import validUrl from 'valid-url';

import { addArticleToPlaylistByUrl } from '../../reducers/playlist';

import { getPlaylistIsLoadingCreateItem } from '../../selectors/playlist';

import styles from './styles';
import { RootState } from '../../reducers';

interface State {
  errorMessage: string;
}

interface IProps {
  url: string;
  type: string;
  closeDelay?: number;
  playlistError: string;
  onPressClose(): void;
  onPressSave(): void;
}

type Props = IProps & StateProps & DispatchProps;

export class ShareModalContainer extends React.PureComponent<Props, State> {
  state = {
    errorMessage: ''
  };

  static defaultProps = {
    closeDelay: 2500
  };

  componentDidMount() {
    const { url } = this.props;

    if (!validUrl.isUri(url)) {
      return this.setState({ errorMessage: `Could not share this URL: ${url}` });
    }

  }

  async componentDidUpdate(prevProps: Props) {
    const { playlistError } = this.props;

    // When a new API error happens
    if (prevProps.playlistError !== playlistError) {
      this.setState({ errorMessage: playlistError });
    }
  }

  addArticleToPlaylist = async () => {
    const { closeDelay, url } = this.props;

    try {
      await this.props.addArticleToPlaylistByUrl(url);

      // Automatically close the modal after X seconds
      setTimeout(() => this.props.onPressClose(), closeDelay);
    } catch (err) {
      return console.log('Error during addArticleToPlaylist.', err);
    }
  }

  renderMessage = () => {
    const { errorMessage } = this.state;
    const { isLoadingCreateItem } = this.props;

    if (isLoadingCreateItem) return null;

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
      <Text>Article is added to your playlist!</Text>
    );
  }

  renderActivityIndicator = () => {
    const { isLoadingCreateItem } = this.props;

    if (!isLoadingCreateItem) return null;

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

interface StateProps {
  isLoadingCreateItem: ReturnType<typeof getPlaylistIsLoadingCreateItem>;
}

interface DispatchProps {
  addArticleToPlaylistByUrl: typeof addArticleToPlaylistByUrl;
}

const mapStateToProps = (state: RootState) => ({
  isLoadingCreateItem: getPlaylistIsLoadingCreateItem(state)
});

const mapDispatchToProps = {
  addArticleToPlaylistByUrl
};

export const ShareModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareModalContainer);

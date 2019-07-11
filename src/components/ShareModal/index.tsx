import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import validUrl from 'valid-url';

import { addArticleToPlaylistByUrl } from '../../reducers/playlist';

import { selectPlaylistError } from '../../selectors/playlist';

import styles from './styles';
import { RootState } from '../../reducers';
import fonts from '../../constants/fonts';
import colors from '../../constants/colors';

interface State {
  errorMessage: string;
  isLoading: boolean;
}

interface IProps {
  url?: string;
  documentHtml?: string;
  playlistError: string;
  onPressClose(): void;
  onPressSave(): void;
}

type Props = IProps & StateProps & DispatchProps;

export class ShareModalContainer extends React.PureComponent<Props, State> {
  state = {
    errorMessage: '',
    isLoading: true // Start in loading state
  };

  componentDidMount() {
    const { url, documentHtml } = this.props;

    // If we did not receive a URL, error
    if (!url) {
      return this.setState({
        errorMessage: 'Could not add this article to your playlist, because did not receive a URL. Please contact support when this happens.',
        isLoading: false
      });
    }

    // If there's a URL, but it's not a valid url, error
    if (!validUrl.isUri(url)) {
      return this.setState({
        errorMessage: `Could not add this article to your playlist, because it does not seem to be a valid URL: "${url}"`,
        isLoading: false
      });
    }

    this.addArticleToPlaylist(url, documentHtml);
  }

  async componentDidUpdate(prevProps: Props) {
    const { playlistError } = this.props;

    // When a new API error happens, we show a message to the user
    if (prevProps.playlistError !== playlistError) {
      return this.setState({
        errorMessage: playlistError,
        isLoading: false
      });
    }
  }

  addArticleToPlaylist = async (url: string, documentHtml?: string) => {
    try {
      // Do the API call to add the URL to the user's playlist
      await this.props.addArticleToPlaylistByUrl(url, documentHtml);

      // Automatically close the modal after X seconds
      setTimeout(() => this.props.onPressClose(), 2500);
    } finally {
      this.setState({
        isLoading: false
      });
    }
  }

  renderMessage = () => {
    const { errorMessage, isLoading } = this.state;

    if (isLoading) return null;

    if (errorMessage) {
      return <Text style={{ color: 'red' }}>{errorMessage}</Text>;
    }

    return <Text style={{ fontSize: fonts.fontSize.body, color: colors.green, fontWeight: fonts.fontWeight.semibold }}>Article is added to your playlist!</Text>;
  }

  renderActivityIndicator = () => {
    const { isLoading } = this.state;

    if (!isLoading) return null;

    return <ActivityIndicator size="small" />;
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
          </View>
        </View>
      </View>
    );
  }
}

interface StateProps {
  playlistError: ReturnType<typeof selectPlaylistError>;
}

interface DispatchProps {
  addArticleToPlaylistByUrl: typeof addArticleToPlaylistByUrl;
}

const mapStateToProps = (state: RootState) => ({
  playlistError: selectPlaylistError(state)
});

const mapDispatchToProps = {
  addArticleToPlaylistByUrl
};

export const ShareModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareModalContainer);

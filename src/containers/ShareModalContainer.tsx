import React from 'react';
import { connect } from 'react-redux';
import validUrl from 'valid-url';

import { addArticleToPlaylistByUrl } from '../reducers/playlist';

import { selectPlaylistError } from '../selectors/playlist';

import { ShareModal } from '../components/ShareModal';
import { RootState } from '../reducers';

interface State {
  errorMessage: string;
  isSuccess: boolean;
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

export class ShareModalContainerComponent extends React.PureComponent<Props, State> {
  state = {
    errorMessage: '',
    isSuccess: false,
    isLoading: true // Start in loading state
  };

  timeout: NodeJS.Timeout | null = null;

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

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { playlistError } = this.props;

    // When a new API error happens, we show a message to the user
    if (playlistError && prevProps.playlistError !== playlistError) {
      return this.setState({
        errorMessage: playlistError,
        isLoading: false,
        isSuccess: false
      });
    }
  }

  addArticleToPlaylist = async (url: string, documentHtml?: string) => {
    try {
      // Do the API call to add the URL to the user's playlist
      await this.props.addArticleToPlaylistByUrl(url, documentHtml);

      this.setState({ isSuccess: true, isLoading: false });

      // Automatically close the modal after X seconds
      this.timeout = setTimeout(() => this.props.onPressClose(), 2500);
    } catch (err) {
      this.setState({
        isLoading: false,
        isSuccess: false
      });

      return err;
    }
  }

  render() {
    const { onPressClose } = this.props;
    const { isLoading, errorMessage, isSuccess } = this.state;

    return (
      <ShareModal isLoading={isLoading} isError={!!errorMessage} isSuccess={isSuccess} errorMessage={errorMessage} onPressClose={onPressClose} />
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

export const ShareModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareModalContainerComponent);

import * as React from 'React';
import { Alert } from 'react-native';
import { Article } from './Article';

interface State {
  isLoading: boolean;
  isPlaying: boolean;
}

interface Props {
  playbackStatus: string;
  playingTrack: any; // TODO: use type
  article: Api.Article;
  getAudioByArticleUrl(articleUrl: string): void;
  setTrack(track: any): void; // TODO: use type
  seperated: boolean;
}

export class ArticleContainer extends React.PureComponent<Props, State> {
  state = {
    isLoading: false,
    isPlaying: false
  };

  componentDidUpdate() {
    const { playbackStatus, playingTrack, article } = this.props;

    if (
      playingTrack
      && playbackStatus === 'playing'
      && playingTrack.id === article.id
    ) {
      this.setState({ isPlaying: true });
    } else {
      this.setState({ isPlaying: false });
    }
  }

  handleOnArticlePlayPress = async () => {
    const { isLoading, isPlaying } = this.state;
    const { article, getAudioByArticleUrl, setTrack } = this.props;

    if (isLoading) return Alert.alert('Wait, we are loading an audiofile...');

    if (isPlaying) {
      // TODO: should trigger to stop the audio player
      return this.setState({ isPlaying: false });
    }

    getAudioByArticleUrl(article.url);

    // TODO: Should set track when audio file is in?
    return setTrack({
      id: article.id,
      title: article.title,
      artist: article.authorName,
      album: `${article.categoryName} on ${article.sourceName}`
    });
  }

  render() {
    const { isLoading, isPlaying } = this.state;
    const { article, seperated } = this.props;

    return (
      <Article
        isLoading={isLoading}
        isPlaying={isPlaying}
        seperated={seperated}
        title={article.title}
        description={article.description}
        sourceName={article.sourceName}
        authorName={article.authorName}
        listenTimeInMinutes={article.listenTimeInMinutes}
        onPlayPress={this.handleOnArticlePlayPress}
      />
    );
  }
}

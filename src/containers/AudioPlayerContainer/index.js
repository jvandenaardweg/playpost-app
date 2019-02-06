import React from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import styles from './styles';

import { AudioPlayer } from '../../components/AudioPlayer';


class AudioPlayerContainerComponent extends React.PureComponent {
  componentDidMount () {
    // this.props.listArticles('relferreira');
  }

  render() {
    const { trackUrl } = this.props;

    return (
      <AudioPlayer trackUrl={trackUrl} />
    );
  }
}

const mapStateToProps = ({ tracks }) => {
  console.log(tracks)
  // let storedRepositories = articles.articles.map(repo => ({ key: repo.id, ...repo }));
  return {
    trackUrl: tracks.track
  };
};

const mapDispatchToProps = {
  // listArticles,
  // getTrackByArticleUrl
};

export const AudioPlayerContainer = connect(mapStateToProps, mapDispatchToProps)(AudioPlayerContainerComponent);

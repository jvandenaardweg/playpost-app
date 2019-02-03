import React from 'react';
import { FlatList } from 'react-native';
import styles from './styles';

import { Article } from '../../components/Article';

export class ArticlesContainer extends React.PureComponent {

  state = {
    articles: [1,2,3,4,5,6,7,8,9,10]
  }

  render() {
    const { articles } = this.state;

    return (
      <FlatList
        data={articles}
        keyExtractor={(article, index) => index.toString()}
        renderItem={({article}) => <Article />}
      />
    );
  }
}

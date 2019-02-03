import React from 'react';
import { FlatList } from 'react-native';
import styles from './styles';

import { Article } from '../../components/Article';

export class ArticlesContainer extends React.PureComponent {

  state = {
    articles: [1,2,3,4,5,6,7,8,9,10]
  }
  render() {
    return (
      <FlatList
        data={this.state.articles}
        renderItem={({article, index}) => <Article key={index} />}
      />
    );
  }
}

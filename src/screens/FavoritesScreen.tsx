import React from 'react';
import { EmptyState } from '../components/EmptyState';

export class FavoritesScreen extends React.PureComponent {
  static navigationOptions = {
    title: 'Favorites'
  };

  render() {
    return (
      <EmptyState title="Your favorite articles" description="Articles you really liked can be added to your favorites" />
    );
  }
}

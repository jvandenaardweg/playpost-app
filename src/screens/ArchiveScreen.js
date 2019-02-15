import React from 'react';
import { EmptyState } from '../components/EmptyState';

export default class ArchiveScreen extends React.Component {
  static navigationOptions = {
    title: 'Archive'
  };

  render() {
    return (
      <EmptyState title='Nothing in your archive, yet' description='Articles you’ve already listened will be shown in your archive' />
    );
  }
}

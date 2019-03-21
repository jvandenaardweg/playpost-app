import React from 'react';
import { EmptyState } from '../components/EmptyState';

export class ArchiveScreen extends React.PureComponent {
  static navigationOptions = {
    title: 'Archive'
  };

  render() {
    return (
      <EmptyState title="Your archived articles" description="Articles you’ve already listened will be shown in your archive. Not available yet in this version." />
    );
  }
}

import * as React from 'React';
import { EmptyState } from '../components/EmptyState';

export class ArchiveScreen extends React.PureComponent {
  static navigationOptions = {
    title: 'Archive'
  };

  render() {
    return (
      <EmptyState title="Nothing in your archive, yet" description="Articles you’ve already listened will be shown in your archive" />
    );
  }
}

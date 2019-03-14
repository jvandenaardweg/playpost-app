import React from 'react';
import { EmptyState } from '../components/EmptyState';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class BrowserScreen extends React.PureComponent<Props> {
  static navigationOptions = {
    title: 'Browser'
  };

  render() {
    const url = this.props.navigation.getParam('url', null);
    return (
      <EmptyState title="Should show browser" description={url} />
    );
  }
}

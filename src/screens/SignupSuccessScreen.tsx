import React from 'react';
import { NavigationRoute, NavigationScreenProp, NavigationStackScreenOptions } from 'react-navigation';

import { EmptyState } from '../components/EmptyState';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class SignupSuccessScreen extends React.PureComponent<Props> {
  static navigationOptions = (): NavigationStackScreenOptions => {
    return {
      title: 'Signup success',
      header: null
    };
  }

  render() {
    return (
      <EmptyState
        title={'Welcome to Playpost!'}
        description={[
          'You can now add articles to your playlist from every app on your phone.'
        ]}
        actionButtonLabel="Go to my playlist"
        actionButtonOnPress={() => this.props.navigation.navigate('Playlist')}
      />
    );
  }
}

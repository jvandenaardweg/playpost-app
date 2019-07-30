import React from 'react';
import { NavigationRoute, NavigationScreenOptions, NavigationScreenProp } from 'react-navigation';

import { ContentView } from '../../components/ContentView';
import { URL_FEEDBACK } from '../../constants/urls';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class ContentViewScreen extends React.PureComponent<Props> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationScreenOptions => {
    return {
      headerLeft: null
    };
  }

  handleOnPressSupport = () => this.props.navigation.navigate('Browser', { url: URL_FEEDBACK, title: 'Support' })

  render() {
    return (
      <ContentView onPressSupport={this.handleOnPressSupport} />
    );
  }
}

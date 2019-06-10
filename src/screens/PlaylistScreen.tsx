import React from 'react';
import { NavigationScreenProp, NavigationRoute, NavigationStackScreenOptions } from 'react-navigation';

import { PlaylistContainer } from '../containers/PlaylistContainer';
import { AppBackground } from '../components/AppBackground';
import { ButtonUpgrade } from '../components/ButtonUpgrade';

import { AppStateContext } from '../contexts/AppStateProvider';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}
export class PlaylistScreen extends React.PureComponent<Props> {
  static contextType = AppStateContext;

  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: 'Playlist',
      headerRight: <ButtonUpgrade onPress={navigation.getParam('handleOnPressUpgrade')} />
    };
  }

  componentDidMount() {
    const { isSubscribed } = this.context;
    console.log('isSubscribed', isSubscribed);

    this.props.navigation.setParams({ handleOnPressUpgrade: this.handleOnPressUpgrade });
  }

  handleOnPressUpgrade = () => {
    this.props.navigation.navigate('Upgrade');
  }

  render() {
    return (
      <AppBackground>
        <PlaylistContainer />
      </AppBackground>
    );
  }
}

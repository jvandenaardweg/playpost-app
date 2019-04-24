import React from 'react';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';

import { PlaylistsContainer } from '../components/Playlists';
import { AppBackground } from '../components/AppBackground';
import { ButtonUpgrade } from '../components/Header/ButtonUpgrade';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}
export class PlaylistScreen extends React.PureComponent<Props> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }) => {
    return {
      title: 'Playlist',
      headerRight: <ButtonUpgrade onPress={navigation.getParam('handleOnPressUpgrade')} />
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleOnPressUpgrade: this.handleOnPressUpgrade });
  }

  handleOnPressUpgrade = () => {
    this.props.navigation.navigate('Upgrade');
  }

  render() {
    return (
      <AppBackground>
        <PlaylistsContainer />
      </AppBackground>
    );
  }
}

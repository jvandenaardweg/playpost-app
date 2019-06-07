import React from 'react';
import { NavigationScreenProp, NavigationRoute, NavigationStackScreenOptions } from 'react-navigation';

import { PlaylistContainer } from '../containers/PlaylistContainer';
import { AppBackground } from '../components/AppBackground';
import { ButtonUpgrade } from '../components/ButtonUpgrade';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}
export class ArchiveScreen extends React.PureComponent<Props> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: 'Archive',
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
        <PlaylistContainer isArchiveScreen />
      </AppBackground>
    );
  }
}

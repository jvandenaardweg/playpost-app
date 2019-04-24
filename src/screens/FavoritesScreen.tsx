import React from 'react';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';

import { EmptyState } from '../components/EmptyState';
import { ButtonUpgrade } from '../components/Header/ButtonUpgrade';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}
export class FavoritesScreen extends React.PureComponent<Props> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }) => {
    return {
      title: 'Favorites',
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
      <EmptyState title="Your favorite articles" description="Articles you really liked can be added to your favorites. Not available yet in this version." />
    );
  }
}

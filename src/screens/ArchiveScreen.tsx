import React from 'react';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';

import { EmptyState } from '../components/EmptyState';
import { ButtonUpgrade } from '../components/Header/ButtonUpgrade';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}
export class ArchiveScreen extends React.PureComponent<Props> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }) => {
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
      <EmptyState title="Your archived articles" description="Articles you’ve already listened will be shown in your archive. Not available yet in this version." />
    );
  }
}

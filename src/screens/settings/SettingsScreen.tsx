import React from 'react';

import { SettingsContainer } from '../../containers/SettingsContainer';
import { AppBackground } from '../../components/AppBackground';

export class SettingsScreen extends React.PureComponent {
  render() {
    return (
      <AppBackground>
        <SettingsContainer />
      </AppBackground>
    );
  }
}

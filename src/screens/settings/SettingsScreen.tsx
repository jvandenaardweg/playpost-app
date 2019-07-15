import React from 'react';

import { AppBackground } from '../../components/AppBackground';
import { SettingsContainer } from '../../containers/SettingsContainer';

export class SettingsScreen extends React.PureComponent {
  public render() {
    return (
      <AppBackground>
        <SettingsContainer />
      </AppBackground>
    );
  }
}

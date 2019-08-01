import React from 'react';

import { AppBackground } from '../../components/AppBackground';
import { InteractionManaged } from '../../components/InteractionManaged';
import { SettingsContainer } from '../../containers/SettingsContainer';

export class SettingsScreen extends React.PureComponent {
  render(): JSX.Element {
    return (
      <InteractionManaged>
        <AppBackground>
          <SettingsContainer />
        </AppBackground>
      </InteractionManaged>
    );
  }
}

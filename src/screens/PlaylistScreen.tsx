import React from 'react';

import { PlaylistContainer } from '../containers/PlaylistContainer';
import { AppBackground } from '../components/AppBackground';

import { AppStateContext } from '../contexts/AppStateProvider';

export class PlaylistScreen extends React.PureComponent {
  static contextType = AppStateContext;

  componentDidMount() {
    const { isSubscribed } = this.context;
    console.log('isSubscribed', isSubscribed);
  }

  render() {
    return (
      <AppBackground>
        <PlaylistContainer />
      </AppBackground>
    );
  }
}

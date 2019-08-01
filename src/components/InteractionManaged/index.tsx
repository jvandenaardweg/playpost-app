import React from 'react';
import { InteractionManager } from 'react-native';

interface Props {
  children?: React.ReactElement
}

interface State {
  isMounted: boolean;
}

export class InteractionManaged extends React.PureComponent<Props, State> {
  state = {
    isMounted: false,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ isMounted: true });
    });
  }

  render() {
    const { isMounted } = this.state;

    if (!isMounted) {
      return null;
    }

    return this.props.children;
  }
}

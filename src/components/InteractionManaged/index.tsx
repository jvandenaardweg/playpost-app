import React from 'react';
import { Animated, InteractionManager } from 'react-native';
import { CenterLoadingIndicator } from '../CenterLoadingIndicator';

interface Props {
  children?: React.ReactElement;
  isAnimated?: boolean;
  showActivityIndicator?: boolean;
}

interface State {
  isMounted: boolean;
}

export class InteractionManaged extends React.PureComponent<Props, State> {
  static defaultProps = {
    isAnimated: true,
    showActivityIndicator: false
  }

  state = {
    isMounted: false,
  };

  opacityAnim = new Animated.Value(0);

  timeout: NodeJS.Timeout | null = null;

  componentDidMount() {
    const { isAnimated } = this.props;

    InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => {
        this.setState({ isMounted: true }, () => {
          if (!isAnimated) {
            return
          }

          Animated.timing(this.opacityAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
          }).start();
        });
      });
    });
  }

  render() {
    const { isMounted } = this.state;
    const { showActivityIndicator } = this.props;

    if (!isMounted && !showActivityIndicator) {
      return null;
    }

    if (!isMounted && showActivityIndicator) {
      return <CenterLoadingIndicator />;
    }

    return (
      <Animated.View style={{ flex: 1, opacity: this.opacityAnim }}>
        {this.props.children}
      </Animated.View>
    )
  }
}

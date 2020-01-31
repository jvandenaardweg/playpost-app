import React, { useEffect, useState } from 'react';
import { Animated } from 'react-native';
import { CenterLoadingIndicator } from '../CenterLoadingIndicator';

interface Props {
  children?: React.ReactElement;
  isAnimated?: boolean;
  showActivityIndicator?: boolean;
}

interface State {
  isMounted: boolean;
}

export const InteractionManaged: React.FC<Props> = React.memo((props) => {
  const [isMounted, setIsMounted] = useState<State['isMounted']>(false)

  const opacityAnim = new Animated.Value(0)

  useEffect(() => {
    setIsMounted(true)

    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    }).start();
  }, [isMounted, opacityAnim])

  if (!isMounted && !props.showActivityIndicator) {
    return null;
  }

  if (!isMounted && props.showActivityIndicator) {
    return <CenterLoadingIndicator />;
  }

  return (
    <Animated.View style={{ flex: 1, opacity: opacityAnim }}>
      {props.children}
    </Animated.View>
  )
})

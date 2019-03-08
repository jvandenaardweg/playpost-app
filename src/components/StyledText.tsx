import * as React from 'React';
import { Text } from 'react-native';

export const MonoText = (props: any) => {
  const { style } = props;

  return (
    <Text {...props} style={[style, { fontFamily: 'space-mono' }]} />
  );
};
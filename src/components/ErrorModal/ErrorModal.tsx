import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';

interface Props {
  onPressAction(url: string): void;
  message: string | null;
  action: string | null;
}

export const ErrorModal = (props: Props) => (
  <View style={{
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10
  }}>
    <Text>{props.message}</Text>

    {props.action === 'login' && (
      <View>
        <Button title="Close" type="outline" onPress={() => props.onPressAction('readto://Onboarding')} />
        <Button title="Login" onPress={() => props.onPressAction('readto://Onboarding')} />
      </View>
    )}

    {props.action === 'playlist' && (
      <View>
        <Button title="Close" type="outline" onPress={() => props.onPressAction('readto://Onboarding')} />
        <Button title="Login" onPress={() => props.onPressAction('readto://Onboarding')} />
      </View>
    )}

  </View>
);

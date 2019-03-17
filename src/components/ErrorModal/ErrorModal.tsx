import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';

interface Props {
  onPressAction(url: string): void;
  message: string;
  action: string;
}

export const ErrorModal: React.FC<Props> = ({ message, action, onPressAction }) => (
  <View style={{
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10
  }}>
    <Text>{message}</Text>

    {action === 'login' && (
      <View>
        <Button title="Close" type="outline" onPress={() => onPressAction('readto://Onboarding')} />
        <Button title="Login" onPress={() => onPressAction('readto://Onboarding')} />
      </View>
    )}

    {action === 'playlist' && (
      <View>
        <Button title="Close" type="outline" onPress={() => onPressAction('readto://Onboarding')} />
        <Button title="Login" onPress={() => onPressAction('readto://Onboarding')} />
      </View>
    )}

  </View>
);

import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import spacing from '../../constants/spacing';

interface Props {
  onPressAction(url: string): void;
  message: string;
  action: string;
}

export const ErrorModal: React.FC<Props> = React.memo(({ message, action, onPressAction }) => (
  <View style={{
    backgroundColor: 'white',
    padding: spacing.default,
    borderRadius: 10
  }}>
    <Text>{message}</Text>

    {action === 'login' && (
      <View>
        <Button title="Close" type="outline" onPress={() => onPressAction('playpost://Onboarding')} />
        <Button title="Login" onPress={() => onPressAction('playpost://Onboarding')} />
      </View>
    )}

    {action === 'playlist' && (
      <View>
        <Button title="Close" type="outline" onPress={() => onPressAction('playpost://Onboarding')} />
        <Button title="Login" onPress={() => onPressAction('playpost://Onboarding')} />
      </View>
    )}

  </View>
));

import React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import spacing from '../../constants/spacing';

interface Props {
  message: string;
  action: string;
  onPressAction(url: string): void;
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

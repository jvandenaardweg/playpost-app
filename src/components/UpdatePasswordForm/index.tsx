import React from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { Button } from 'react-native-elements';
import { InputGroupPassword } from '../InputGroup/password';
import styles from './styles';

export interface Props {
  password: string;
  isLoading: boolean;
  isSuccess: boolean;
  onChangeText(field: string, text: string): void;
  onPressUpdatePassword(): void;
}

export const UpdatePasswordForm: React.FC<Props> = React.memo(({ onChangeText, onPressUpdatePassword, password, isLoading, isSuccess }) => {

  // Android and iOS both interact with this prop differently.
  // Android may behave better when given no behavior prop at all, whereas iOS is the opposite.
  // https://facebook.github.io/react-native/docs/keyboardavoidingview#behavior
  const behaviorOption = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <KeyboardAvoidingView testID="UpdatePasswordForm" style={styles.container} behavior={behaviorOption} keyboardVerticalOffset={60} enabled>
      <View style={styles.form}>

        <InputGroupPassword
          testID="UpdatePasswordForm-TextInput-password"
          placeholder="Your new super secret password"
          value={password}
          onChangeText={(text: string) => onChangeText('password', text)}
          onSubmitEditing={() => onPressUpdatePassword()}
          editable={!isLoading}
          returnKeyType="done"
          autoFocus
        />

        <View>
          <Button
            testID="UpdatePasswordForm-Button-update"
            title={isSuccess ? 'New password saved!' : 'Save new password'}
            loading={isLoading}
            onPress={onPressUpdatePassword}
            disabled={isLoading || isSuccess}
            activeOpacity={1}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
});

import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button } from 'react-native-elements';

import { InputGroupEmail } from '../InputGroup/email';
import styles from './styles';

interface Props {
  email: string;
  isLoading: boolean;
  isSuccess: boolean | null;
  onChangeText(field: string, text: string): void;
  onPressResetPassword(): void;
  onPressResetPasswordCode(): void;
}

export const LoginForgotPasswordForm: React.FC<Props> = React.memo(
  ({ email, isLoading, onChangeText, onPressResetPassword, onPressResetPasswordCode }) => {

    // Android and iOS both interact with this prop differently.
    // Android may behave better when given no behavior prop at all, whereas iOS is the opposite.
    // https://facebook.github.io/react-native/docs/keyboardavoidingview#behavior
    const behaviorOption = Platform.OS === 'ios' ? 'padding' : undefined;

    return (
      <KeyboardAvoidingView testID="LoginForgotPasswordForm" style={styles.container} keyboardVerticalOffset={60} behavior={behaviorOption} enabled>
        <ScrollView style={styles.form} contentContainerStyle={styles.formContent} keyboardShouldPersistTaps={'handled'}>

          <InputGroupEmail
            testID="LoginForgotPasswordForm-TextInput-email"
            value={email}
            onChangeText={text => onChangeText('email', text)}
            onSubmitEditing={() => onPressResetPassword()}
            editable={!isLoading || !isLoading}
            returnKeyType="next"
            clearButtonMode="always"
            autoFocus
          />

          <View>
            <Button
              testID="LoginForgotPasswordForm-Button-reset-password"
              title="Reset my password"
              loading={isLoading}
              onPress={onPressResetPassword}
              disabled={isLoading}
              activeOpacity={1}
            />
            <Button
              testID="LoginForgotPasswordForm-Button-reset-password-code"
              title="Already have reset password code?"
              type="clear"
              disabled={isLoading}
              onPress={onPressResetPasswordCode}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
);

import React, { useContext } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button } from '../Button';

import { UserThemeContext } from '../../contexts/UserThemeProvider';
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

export const LoginForgotPasswordForm: React.FC<Props> = React.memo((props) => {
  const { theme } = useContext(UserThemeContext);

    // Android and iOS both interact with this prop differently.
    // Android may behave better when given no behavior prop at all, whereas iOS is the opposite.
    // https://facebook.github.io/react-native/docs/keyboardavoidingview#behavior
    const behaviorOption = Platform.OS === 'ios' ? 'padding' : undefined;

    return (
      <KeyboardAvoidingView testID="LoginForgotPasswordForm" style={styles(theme).container} keyboardVerticalOffset={60} behavior={behaviorOption} enabled>
        <ScrollView style={styles(theme).form} contentContainerStyle={styles(theme).formContent} keyboardShouldPersistTaps={'handled'}>

          <InputGroupEmail
            testID="LoginForgotPasswordForm-TextInput-email"
            value={props.email}
            onChangeText={text => props.onChangeText('email', text)}
            onSubmitEditing={() => props.onPressResetPassword()}
            editable={!props.isLoading || !props.isLoading}
            returnKeyType="next"
            clearButtonMode="always"
            autoFocus
          />

          <View>
            <Button
              testID="LoginForgotPasswordForm-Button-reset-password"
              title="Reset my password"
              loading={props.isLoading}
              onPress={props.onPressResetPassword}
              disabled={props.isLoading}
              activeOpacity={1}
            />
            <Button
              testID="LoginForgotPasswordForm-Button-reset-password-code"
              title="Already have reset password code?"
              type="clear"
              disabled={props.isLoading}
              onPress={props.onPressResetPasswordCode}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
);

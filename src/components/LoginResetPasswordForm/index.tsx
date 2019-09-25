import React, { useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { Button } from 'react-native-elements';

import { InputGroup } from '../InputGroup';
import { InputGroupPassword } from '../InputGroup/password';
import Text from '../Text';
import styles from './styles';

interface Props {
  password: string;
  resetPasswordToken: string;
  isLoading: boolean;
  isSuccess: boolean | null;
  onChangeText(field: string, text: string): void;
  onPressUpdatePassword(): void;
}

export const LoginResetPasswordForm: React.FC<Props> = React.memo(
  ({ password, resetPasswordToken, isLoading, isSuccess, onChangeText, onPressUpdatePassword }) => {
    const passwordInputRef = useRef<TextInput>(null);

    // Android and iOS both interact with this prop differently.
    // Android may behave better when given no behavior prop at all, whereas iOS is the opposite.
    // https://facebook.github.io/react-native/docs/keyboardavoidingview#behavior
    const behaviorOption = Platform.OS === 'ios' ? 'padding' : undefined;

    return (
      <KeyboardAvoidingView testID="LoginResetPasswordForm" style={styles.container} keyboardVerticalOffset={60} behavior={behaviorOption} enabled>
        <ScrollView style={styles.form} contentContainerStyle={styles.formContent} keyboardShouldPersistTaps={'handled'}>
          <Text style={styles.subtitle} preset="lead">Please check your e-mail's inbox for the password reset code and fill it in below.</Text>

          <InputGroup label="Reset password code">
            <TextInput
              testID="LoginResetPasswordForm-TextInput-reset-password-code"
              placeholder="A1B2C3"
              autoCapitalize="characters"
              value={resetPasswordToken}
              onChangeText={text => onChangeText('resetPasswordToken', text)}
              textContentType="username"
              onSubmitEditing={() => passwordInputRef.current && passwordInputRef.current.focus()}
              editable={!isLoading}
              style={styles.textField}
              keyboardType="default"
              returnKeyType="next"
              clearButtonMode="always"
              autoFocus
              blurOnSubmit={false}
            />
          </InputGroup>

          <InputGroupPassword
            textInputRef={passwordInputRef}
            testID="LoginResetPasswordForm-TextInput-password"
            value={password}
            onChangeText={(text: string) => onChangeText('password', text)}
            onSubmitEditing={() => onPressUpdatePassword()}
            editable={!isLoading}
            returnKeyType="done"
          />

          <View>
            <Button
              testID="LoginResetPasswordForm-Button-update-password"
              title={isSuccess ? 'Successfully changed password!' : 'Save new password'}
              loading={isLoading}
              onPress={onPressUpdatePassword}
              disabled={isLoading || !!isSuccess}
              activeOpacity={1}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
);

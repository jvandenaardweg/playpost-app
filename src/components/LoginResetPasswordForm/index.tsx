import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-elements';
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
    let passwordInput: TextInput | null = null;

    // Android and iOS both interact with this prop differently.
    // Android may behave better when given no behavior prop at all, whereas iOS is the opposite.
    // https://facebook.github.io/react-native/docs/keyboardavoidingview#behavior
    const behaviorOption = Platform.OS === 'ios' ? 'padding' : undefined;

    return (
      <KeyboardAvoidingView testID="LoginResetPasswordForm" style={styles.container} behavior={behaviorOption} enabled>
        <ScrollView style={styles.form} contentContainerStyle={styles.formContent} keyboardShouldPersistTaps={'handled'}>
          <Text style={styles.subtitle}>Please check your e-mail's inbox for the password reset code and fill it in below.</Text>

          <TextInput
            testID="LoginResetPasswordForm-TextInput-reset-password-code"
            placeholder="Reset password code, example: A6HC13"
            autoCapitalize="characters"
            value={resetPasswordToken}
            onChangeText={text => onChangeText('resetPasswordToken', text)}
            textContentType="username"
            onSubmitEditing={() => passwordInput && passwordInput.focus()}
            editable={!isLoading}
            style={styles.textField}
            keyboardType="default"
            returnKeyType="next"
            clearButtonMode="always"
            autoFocus
            blurOnSubmit={false}
          />

          <TextInput
            testID="LoginResetPasswordForm-TextInput-password"
            ref={input => {
              passwordInput = input;
            }}
            placeholder="Your new password"
            autoCapitalize="none"
            secureTextEntry
            value={password}
            onChangeText={text => onChangeText('password', text)}
            onSubmitEditing={() => onPressUpdatePassword()}
            editable={!isLoading}
            textContentType="password"
            style={styles.textField}
            returnKeyType="done"
            clearButtonMode="always"
            blurOnSubmit={false}
          />

          <View>
            <Button
              testID="LoginResetPasswordForm-Button-update-password"
              title={isSuccess ? 'Successfully changed password!' : 'Save my new password'}
              loading={isLoading}
              onPress={onPressUpdatePassword}
              disabled={isLoading || !!isSuccess}
              buttonStyle={isSuccess ? styles.buttonStyleSuccess : styles.buttonStyle}
              titleStyle={isSuccess ? styles.buttonTitleStyleSuccess : {}}
              activeOpacity={1}
              disabledStyle={isSuccess ? styles.buttonStyleSuccess : styles.buttonStyle}
              disabledTitleStyle={isSuccess ? styles.buttonTitleStyleSuccess : styles.buttonStyle}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
);

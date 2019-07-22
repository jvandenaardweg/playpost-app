import React from 'react';
import { KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './styles';

interface Props {
  password: string;
  passwordValidation: string;
  isLoading: boolean;
  isSuccess: boolean;
  onChangeText(field: string, text: string): void;
  onPressUpdatePassword(): void;
}

export const UpdatePasswordForm: React.FC<Props> = React.memo(({ onChangeText, onPressUpdatePassword, password, passwordValidation, isLoading, isSuccess }) => {
  let passwordInput: TextInput | null = null;

  // Android and iOS both interact with this prop differently.
  // Android may behave better when given no behavior prop at all, whereas iOS is the opposite.
  // https://facebook.github.io/react-native/docs/keyboardavoidingview#behavior
  const behaviorOption = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <KeyboardAvoidingView testID="UpdatePasswordForm" style={styles.container} behavior={behaviorOption} keyboardVerticalOffset={100} enabled>
      <View style={styles.form}>
        <TextInput
          testID="UpdatePasswordForm-TextInput-password"
          placeholder="Your new password"
          autoCapitalize="none"
          secureTextEntry
          value={password}
          onChangeText={text => onChangeText('password', text)}
          onSubmitEditing={() => passwordInput && passwordInput.focus()}
          editable={!isLoading}
          textContentType="password"
          style={styles.textField}
          returnKeyType="next"
          clearButtonMode="always"
          blurOnSubmit={false}
        />

        <TextInput
          testID="UpdatePasswordForm-TextInput-password-validation"
          ref={input => {
            passwordInput = input;
          }}
          placeholder="Confirm your new password"
          autoCapitalize="none"
          secureTextEntry
          value={passwordValidation}
          onChangeText={text => onChangeText('passwordValidation', text)}
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
            testID="UpdatePasswordForm-Button-update"
            title={isSuccess ? 'Update success!' : 'Update password'}
            loading={isLoading}
            onPress={onPressUpdatePassword}
            disabled={isLoading || isSuccess}
            buttonStyle={isSuccess ? styles.buttonStyleSuccess : styles.buttonStyle}
            titleStyle={isSuccess ? styles.buttonTitleStyleSuccess : {}}
            activeOpacity={1}
            disabledStyle={isSuccess ? styles.buttonStyleSuccess : styles.buttonStyle}
            disabledTitleStyle={isSuccess ? styles.buttonTitleStyleSuccess : styles.buttonStyle}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
});

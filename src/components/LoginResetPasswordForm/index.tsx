import React from 'react';
import { View, TextInput, KeyboardAvoidingView, ScrollView, Text } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './styles';

interface Props {
  onChangeText(field: string, text: string): void;
  onPressUpdatePassword(): void;
  password: string;
  resetPasswordToken: string;
  isLoading: boolean;
  isSuccess: boolean | null;
}

export const LoginResetPasswordForm: React.FC<Props> = React.memo(({
  password,
  resetPasswordToken,
  isLoading,
  isSuccess,
  onChangeText,
  onPressUpdatePassword
}) => {

  let passwordInput: TextInput | null = null;

  return (
    <KeyboardAvoidingView testID="reset-password-form" style={styles.container} behavior="padding" enabled>
      <ScrollView style={styles.form} contentContainerStyle={styles.formContent} keyboardShouldPersistTaps={'handled'}>

        <Text style={styles.subtitle}>Please check your e-mail's inbox for the password reset code and fill it in below.</Text>

        <TextInput
          placeholder="Reset password code, example: A6HC13"
          autoCapitalize="characters"
          value={resetPasswordToken}
          onChangeText={text => onChangeText('resetPasswordToken', text)}
          textContentType="username"
          onSubmitEditing={() => { passwordInput && passwordInput.focus(); }}
          style={styles.textField}
          keyboardType="default"
          returnKeyType="next"
          clearButtonMode="always"
          autoFocus
          blurOnSubmit={false}
        />

        <TextInput
          ref={(input) => { passwordInput = input; }}
          placeholder="Your new password"
          autoCapitalize="none"
          secureTextEntry
          value={password}
          onChangeText={text => onChangeText('password', text)}
          onSubmitEditing={() => onPressUpdatePassword()}
          textContentType="password"
          style={styles.textField}
          returnKeyType="done"
          clearButtonMode="always"
          blurOnSubmit={false}
        />

        <View>
          <Button
            title={(isSuccess) ? 'Successfully changed password!' : 'Save my new password'}
            loading={isLoading}
            onPress={onPressUpdatePassword}
            disabled={isLoading || !!isSuccess}
            buttonStyle={(isSuccess) ? styles.buttonStyleSuccess : styles.buttonStyle}
            titleStyle={(isSuccess) ? styles.buttonTitleStyleSuccess : {}}
            activeOpacity={1}
            disabledStyle={(isSuccess) ? styles.buttonStyleSuccess : styles.buttonStyle}
            disabledTitleStyle={(isSuccess) ? styles.buttonTitleStyleSuccess : styles.buttonStyle}
          />
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
});

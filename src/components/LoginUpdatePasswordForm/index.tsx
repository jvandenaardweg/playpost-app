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

export const LoginUpdatePasswordForm: React.FC<Props> = React.memo(({
  password,
  resetPasswordToken,
  isLoading,
  isSuccess,
  onChangeText,
  onPressUpdatePassword
}) => {

  let passwordInput: TextInput | null = null;

  return (
    <KeyboardAvoidingView testID="login-form" style={styles.container} behavior="padding" enabled>
      <ScrollView style={styles.form} contentContainerStyle={styles.formContent} keyboardShouldPersistTaps={'handled'}>

        <TextInput
          placeholder="6 character reset password code"
          autoCapitalize="characters"
          value={resetPasswordToken}
          onChangeText={text => onChangeText('resetPasswordToken', text)}
          textContentType="username"
          onSubmitEditing={() => { passwordInput && passwordInput.focus(); }}
          style={styles.textField}
          keyboardType="default"
          returnKeyType="next"
          clearButtonMode="always"
          // autoFocus
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
          {isSuccess && <Text>Success!</Text>}
          <Button title="Save my new password" loading={isLoading} onPress={onPressUpdatePassword} disabled={isLoading} buttonStyle={styles.buttonStyle} disabledStyle={styles.buttonStyle} activeOpacity={1} titleStyle={styles.buttonTitleStyle} />
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
});

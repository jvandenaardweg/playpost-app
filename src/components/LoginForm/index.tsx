import React from 'react';
import { View, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './styles';

interface Props {
  onChangeText(field: string, text: string): void;
  onPressLogin(): void;
  onPressForgotPassword(): void;
  email: string;
  password: string;
  isLoading: boolean;
}

export const LoginForm: React.FC<Props> = React.memo(({ email, password, isLoading, onChangeText, onPressLogin, onPressForgotPassword }) => {
  let passwordInput: TextInput | null = null;

  return (
    <KeyboardAvoidingView testID="LoginForm" style={styles.container} behavior="padding" enabled>
      <ScrollView style={styles.form} contentContainerStyle={styles.formContent} keyboardShouldPersistTaps={'handled'}>
        <TextInput
          testID="LoginForm-TextInput-email"
          placeholder="E-mail address"
          autoCapitalize="none"
          value={email}
          onChangeText={text => onChangeText('email', text)}
          textContentType="username"
          onSubmitEditing={() => {
            passwordInput && passwordInput.focus();
          }}
          editable={!isLoading}
          style={styles.textField}
          keyboardType="email-address"
          returnKeyType="next"
          clearButtonMode="always"
          autoFocus
          blurOnSubmit={false}
        />

        <TextInput
          testID="LoginForm-TextInput-password"
          ref={input => {
            passwordInput = input;
          }}
          placeholder="Password"
          autoCapitalize="none"
          secureTextEntry
          value={password}
          onChangeText={text => onChangeText('password', text)}
          onSubmitEditing={() => onPressLogin()}
          editable={!isLoading}
          textContentType="password"
          style={styles.textField}
          returnKeyType="done"
          clearButtonMode="always"
          blurOnSubmit={false}
        />

        <View>
          <Button
            testID="LoginForm-Button-login"
            title="Login"
            loading={isLoading}
            onPress={onPressLogin}
            disabled={isLoading}
            buttonStyle={styles.buttonStyle}
            disabledStyle={styles.buttonStyle}
            activeOpacity={1}
            titleStyle={styles.buttonTitleStyle}
          />
          <Button testID="LoginForm-Button-forgot-password" title="Forgot password?" type="clear" onPress={onPressForgotPassword} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

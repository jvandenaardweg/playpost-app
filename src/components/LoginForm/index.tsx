import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './styles';

interface Props {
  email: string;
  password: string;
  isLoading: boolean;
  onChangeText(field: string, text: string): void;
  onPressLogin(): void;
  onPressForgotPassword(): void;
}

export const LoginForm: React.FC<Props> = React.memo(({ email, password, isLoading, onChangeText, onPressLogin, onPressForgotPassword }) => {
  let passwordInput: TextInput | null = null;

  // Android and iOS both interact with this prop differently.
  // Android may behave better when given no behavior prop at all, whereas iOS is the opposite.
  // https://facebook.github.io/react-native/docs/keyboardavoidingview#behavior
  const behaviorOption = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <KeyboardAvoidingView testID="LoginForm" style={styles.container} behavior={behaviorOption} enabled>
      <ScrollView style={styles.form} contentContainerStyle={styles.formContent} keyboardShouldPersistTaps={'handled'}>
        <TextInput
          testID="LoginForm-TextInput-email"
          placeholder="E-mail address"
          autoCapitalize="none"
          value={email}
          onChangeText={text => onChangeText('email', text)}
          textContentType="username"
          onSubmitEditing={() => passwordInput && passwordInput.focus()}
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

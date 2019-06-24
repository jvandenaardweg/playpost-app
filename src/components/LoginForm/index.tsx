import React from 'react';
import { View, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './styles';

interface Props {
  onChangeText(field: string, text: string): void;
  onPressLogin(): void;
  email: string;
  password: string;
  isLoading: boolean;
}

export const LoginForm: React.FC<Props> = React.memo(({
  email,
  password,
  isLoading,
  onChangeText,
  onPressLogin
}) => {

  let passwordInput: TextInput | null = null;

  return (
    <KeyboardAvoidingView testID="login-form" style={styles.container} behavior="padding" enabled>
      <ScrollView style={styles.form} contentContainerStyle={styles.formContent} keyboardShouldPersistTaps={'handled'}>

        <TextInput
          placeholder="E-mail address"
          autoCapitalize="none"
          value={email}
          onChangeText={text => onChangeText('email', text)}
          textContentType="username"
          onSubmitEditing={() => { passwordInput && passwordInput.focus(); }}
          style={styles.textField}
          keyboardType="email-address"
          returnKeyType="next"
          clearButtonMode="always"
          autoFocus
          blurOnSubmit={false}
        />

        <TextInput
          ref={(input) => { passwordInput = input; }}
          placeholder="Password"
          autoCapitalize="none"
          secureTextEntry
          value={password}
          onChangeText={text => onChangeText('password', text)}
          onSubmitEditing={() => onPressLogin()}
          textContentType="password"
          style={styles.textField}
          returnKeyType="done"
          clearButtonMode="always"
          blurOnSubmit={false}
        />

        <View>
          <Button title="Login" loading={isLoading} onPress={onPressLogin} disabled={isLoading} buttonStyle={styles.buttonStyle} disabledStyle={styles.buttonStyle} activeOpacity={1} titleStyle={styles.buttonTitleStyle} />
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
});

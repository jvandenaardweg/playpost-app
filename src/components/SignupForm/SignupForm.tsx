import * as React from 'React';
import { View, Text, TextInput, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './styles';

interface Props {
  onChangeText(field: string, text: string): void;
  onPressLogin(): void;
  onPressSignup(): void;
  email: string;
  password: string;
  passwordValidation: string;
  error: string;
  validationError: string;
  isLoading: boolean;
}

export const SignupForm = ({
  onChangeText,
  onPressLogin,
  onPressSignup,
  email,
  password,
  passwordValidation,
  error,
  validationError,
  isLoading
}: Props) => (
  <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
    <View style={styles.form}>

      <TextInput
        placeholder="E-mail address"
        autoCapitalize="none"
        value={email}
        onChangeText={text => onChangeText('email', text)}
        style={styles.textField}
        keyboardType="email-address"
        returnKeyType="done"
        clearButtonMode="always"
      />

      <TextInput
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry
        value={password}
        onChangeText={text => onChangeText('password', text)}
        textContentType="password"
        style={styles.textField}
        returnKeyType="done"
        clearButtonMode="always"
      />

      <TextInput
        placeholder="Password validation"
        autoCapitalize="none"
        secureTextEntry
        value={passwordValidation}
        onChangeText={text => onChangeText('passwordValidation', text)}
        textContentType="password"
        style={styles.textField}
        returnKeyType="done"
        clearButtonMode="always"
      />

      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{validationError || error}</Text>
      </View>

      <View>
        <Button title="Create account" loading={isLoading} onPress={onPressSignup} disabled={isLoading} buttonStyle={styles.buttonStyle} activeOpacity={1} disabledStyle={styles.buttonStyle} />
        <Button title="I already have an account" type="clear" onPress={onPressLogin} titleStyle={{ color: 'gray', fontWeight: 'normal' }} />
      </View>

    </View>
  </KeyboardAvoidingView>
);

import React from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Linking, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './styles';
import { URL_PRIVACY_POLICY, URL_TERMS_OF_USE } from '../../constants/urls';

interface Props {
  onChangeText(field: string, text: string): void;
  onPressLogin(): void;
  onPressSignup(): void;
  email: string;
  password: string;
  passwordValidation: string;
  isLoading: boolean;
}

export const SignupForm: React.FC<Props> = React.memo(({
  onChangeText,
  onPressLogin,
  onPressSignup,
  email,
  password,
  passwordValidation,
  isLoading
}) => (
  <KeyboardAvoidingView testID="signup-form" style={styles.container} behavior="padding" keyboardVerticalOffset={100} enabled>
    <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>

      <TextInput
        placeholder="E-mail address"
        autoCapitalize="none"
        value={email}
        onChangeText={text => onChangeText('email', text)}
        textContentType="emailAddress"
        style={styles.textField}
        keyboardType="email-address"
        returnKeyType="done"
        clearButtonMode="always"
        blurOnSubmit={false}
        autoFocus
      />

      <TextInput
        placeholder="Your password"
        autoCapitalize="none"
        secureTextEntry
        value={password}
        onChangeText={text => onChangeText('password', text)}
        textContentType="password"
        style={styles.textField}
        returnKeyType="done"
        clearButtonMode="always"
        blurOnSubmit={false}
      />

      <TextInput
        placeholder="Your password again to validate"
        autoCapitalize="none"
        secureTextEntry
        value={passwordValidation}
        onChangeText={text => onChangeText('passwordValidation', text)}
        textContentType="password"
        style={styles.textField}
        returnKeyType="done"
        clearButtonMode="always"
        blurOnSubmit={false}
      />

      <View>
        <Button title="Create account" loading={isLoading} onPress={onPressSignup} disabled={isLoading} buttonStyle={styles.buttonStyle} activeOpacity={1} disabledStyle={styles.buttonStyle} />
      </View>

      <View style={styles.footerContainer}>
        <View style={styles.footer}>
          <Text style={styles.footerText}>By signing up you agree to our </Text>
          <Text style={[styles.footerText, styles.footerTextHighlight]} onPress={() => Linking.openURL(`${URL_PRIVACY_POLICY}?ref=playpost://signup`)}>Privacy Policy</Text>
          <Text style={styles.footerText}> and </Text>
          <Text style={[styles.footerText, styles.footerTextHighlight]} onPress={() => Linking.openURL(`${URL_TERMS_OF_USE}?ref=playpost://signup`)}>Terms of Use</Text>
        </View>
      </View>

    </ScrollView>
  </KeyboardAvoidingView>
));

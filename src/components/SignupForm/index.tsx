import React from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './styles';

interface Props {
  onChangeText(field: string, text: string): void;
  onPressSignup(): void;
  onPressPrivacyPolicy(): void;
  onPressTerms(): void;
  email: string;
  password: string;
  isLoading: boolean;
}

export const SignupForm: React.FC<Props> = React.memo(({ onChangeText, onPressSignup, onPressPrivacyPolicy, onPressTerms, email, password, isLoading }) => {
  let passwordInput: TextInput | null = null;

  return (
    <KeyboardAvoidingView testID="signup-form" style={styles.container} behavior="padding" keyboardVerticalOffset={80} enabled>
      <ScrollView style={styles.form} contentContainerStyle={styles.formContent} keyboardShouldPersistTaps={'handled'}>
        <TextInput
          testID="SignupForm-TextInput-email"
          placeholder="E-mail address"
          autoCapitalize="none"
          value={email}
          onChangeText={text => onChangeText('email', text)}
          textContentType="username"
          onSubmitEditing={() => {
            passwordInput && passwordInput.focus();
          }}
          style={styles.textField}
          keyboardType="email-address"
          returnKeyType="next"
          clearButtonMode="always"
          blurOnSubmit={false}
          autoFocus
        />

        <TextInput
          testID="SignupForm-TextInput-password"
          ref={input => {
            passwordInput = input;
          }}
          placeholder="Your password"
          autoCapitalize="none"
          secureTextEntry
          value={password}
          onChangeText={text => onChangeText('password', text)}
          onSubmitEditing={() => onPressSignup()}
          textContentType="password"
          style={styles.textField}
          returnKeyType="done"
          clearButtonMode="always"
          blurOnSubmit={false}
        />

        <View>
          <Button
            testID="SignupForm-Button-signup"
            title="Create account"
            loading={isLoading}
            onPress={onPressSignup}
            disabled={isLoading}
            buttonStyle={styles.buttonStyle}
            activeOpacity={1}
            disabledStyle={styles.buttonStyle}
          />
        </View>

        <View style={styles.footerContainer}>
          <View style={styles.footer}>
            <Text style={styles.footerText}>By signing up you agree to our </Text>
            <Text style={[styles.footerText, styles.footerTextHighlight]} testID="SignupForm-Text-privacy-policy" onPress={() => onPressPrivacyPolicy()}>
              Privacy Policy
            </Text>
            <Text style={styles.footerText}> and </Text>
            <Text style={[styles.footerText, styles.footerTextHighlight]} testID="SignupForm-Text-terms" onPress={() => onPressTerms()}>
              Terms of Use
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

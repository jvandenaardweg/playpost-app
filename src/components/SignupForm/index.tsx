import React, { useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './styles';

import { URL_PRIVACY_POLICY, URL_TERMS_OF_USE } from '../../constants/urls';
import { InputGroupEmail } from '../InputGroup/email';
import { InputGroupPassword } from '../InputGroup/password';
import { Text } from '../Text';

export interface Props {
  email: string;
  password: string;
  isLoading: boolean;
  onChangeText(field: string, text: string): void;
  onPressSignup(): void;
  onPressOpenUrl(url: string): void;
}

export const SignupForm: React.FC<Props> = React.memo(({ onChangeText, onPressSignup, onPressOpenUrl, email, password, isLoading }) => {
  const passwordInputRef = useRef<TextInput>(null);

  // Android and iOS both interact with this prop differently.
  // Android may behave better when given no behavior prop at all, whereas iOS is the opposite.
  // https://facebook.github.io/react-native/docs/keyboardavoidingview#behavior
  const behaviorOption = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <KeyboardAvoidingView testID="signup-form" style={styles.container} behavior={behaviorOption} keyboardVerticalOffset={60} enabled>
      <ScrollView style={styles.form} contentContainerStyle={styles.formContent} keyboardShouldPersistTaps={'handled'}>

        <InputGroupEmail
          testID="SignupForm-TextInput-email"
          value={email}
          onChangeText={text => onChangeText('email', text)}
          onSubmitEditing={() => passwordInputRef.current && passwordInputRef.current.focus()}
          editable={!isLoading}
          returnKeyType="next"
          clearButtonMode="always"
          autoFocus
        />

        <InputGroupPassword
          textInputRef={passwordInputRef}
          testID="SignupForm-TextInput-password"
          value={password}
          onChangeText={(text: string) => onChangeText('password', text)}
          onSubmitEditing={() => onPressSignup()}
          editable={!isLoading}
          returnKeyType="done"
        />

        <View>
          <Button
            testID="SignupForm-Button-signup"
            title="Create new account"
            loading={isLoading}
            onPress={onPressSignup}
            disabled={isLoading}
            activeOpacity={1}
          />
        </View>

        <View style={styles.footerContainer}>
          <View style={styles.footer}>
            <Text style={styles.footerText} preset="subhead">By signing up you agree to our </Text>
            <Text style={[styles.footerText, styles.footerTextHighlight]} preset="subhead" testID="SignupForm-Text-privacy-policy" onPress={() => onPressOpenUrl(URL_PRIVACY_POLICY)}>
              Privacy Policy
            </Text>
            <Text style={styles.footerText} preset="subhead"> and </Text>
            <Text style={[styles.footerText, styles.footerTextHighlight]} preset="subhead" testID="SignupForm-Text-terms" onPress={() => onPressOpenUrl(URL_TERMS_OF_USE)}>
              Terms of Use
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

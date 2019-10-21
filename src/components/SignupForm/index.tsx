import React, { useContext, useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { Button } from '../Button';
import styles from './styles';

import { URL_PRIVACY_POLICY, URL_TERMS_OF_USE } from '../../constants/urls';
import { UserThemeContext } from '../../contexts/UserThemeProvider';
import { InputGroupEmail } from '../InputGroup/email';
import { InputGroupPassword } from '../InputGroup/password';
import Text from '../Text';

export interface Props {
  email: string;
  password: string;
  isLoading: boolean;
  onChangeText(field: string, text: string): void;
  onPressSignup(): void;
  onPressOpenUrl(url: string): void;
}

export const SignupForm: React.FC<Props> = React.memo((props) => {
  const passwordInputRef = useRef<TextInput>(null);
  const { theme } = useContext(UserThemeContext);

  // Android and iOS both interact with this prop differently.
  // Android may behave better when given no behavior prop at all, whereas iOS is the opposite.
  // https://facebook.github.io/react-native/docs/keyboardavoidingview#behavior
  const behaviorOption = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <KeyboardAvoidingView testID="signup-form" style={styles(theme).container} behavior={behaviorOption} keyboardVerticalOffset={60} enabled>
      <ScrollView style={styles(theme).form} contentContainerStyle={styles(theme).formContent} keyboardShouldPersistTaps={'handled'}>

        <InputGroupEmail
          testID="SignupForm-TextInput-email"
          value={props.email}
          onChangeText={text => props.onChangeText('email', text)}
          onSubmitEditing={() => passwordInputRef.current && passwordInputRef.current.focus()}
          editable={!props.isLoading}
          returnKeyType="next"
          clearButtonMode="always"
          autoFocus
        />

        <InputGroupPassword
          textInputRef={passwordInputRef}
          testID="SignupForm-TextInput-password"
          value={props.password}
          onChangeText={(text: string) => props.onChangeText('password', text)}
          onSubmitEditing={() => props.onPressSignup()}
          editable={!props.isLoading}
          returnKeyType="done"
        />

        <View>
          <Button
            testID="SignupForm-Button-signup"
            title="Create new account"
            loading={props.isLoading}
            onPress={props.onPressSignup}
            disabled={props.isLoading}
            activeOpacity={1}
          />
        </View>

        <View style={styles(theme).footerContainer}>
          <View style={styles(theme).footer}>
            <Text style={styles(theme).footerText} preset="subhead">By signing up you agree to our </Text>
            <Text style={[styles(theme).footerText, styles(theme).footerTextHighlight]} preset="subhead" testID="SignupForm-Text-privacy-policy" onPress={() => props.onPressOpenUrl(URL_PRIVACY_POLICY)}>
              Privacy Policy
            </Text>
            <Text style={styles(theme).footerText} preset="subhead"> and </Text>
            <Text style={[styles(theme).footerText, styles(theme).footerTextHighlight]} preset="subhead" testID="SignupForm-Text-terms" onPress={() => props.onPressOpenUrl(URL_TERMS_OF_USE)}>
              Terms of Use
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

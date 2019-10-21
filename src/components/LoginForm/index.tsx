import React, { useContext, useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { Button } from '../Button';

import spacing from '../../constants/spacing';
import { UserThemeContext } from '../../contexts/UserThemeProvider';
import { InputGroupEmail } from '../InputGroup/email';
import { InputGroupPassword } from '../InputGroup/password';
import styles from './styles';

export interface Props {
  email: string;
  password: string;
  isLoading: boolean;
  onChangeText(field: string, text: string): void;
  onPressLogin(): void;
  onPressForgotPassword(): void;
}

export const LoginForm: React.FC<Props> = React.memo((props) => {
  const passwordInputRef = useRef<TextInput>(null);
  const { theme } = useContext(UserThemeContext);

  // Android and iOS both interact with this prop differently.
  // Android may behave better when given no behavior prop at all, whereas iOS is the opposite.
  // https://facebook.github.io/react-native/docs/keyboardavoidingview#behavior
  const behaviorOption = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <KeyboardAvoidingView testID="LoginForm" style={styles(theme).container} keyboardVerticalOffset={60} behavior={behaviorOption} enabled>
      <ScrollView style={styles(theme).form} contentContainerStyle={styles(theme).formContent} keyboardShouldPersistTaps={'handled'}>

        <InputGroupEmail
          testID="LoginForm-TextInput-email"
          value={props.email}
          onChangeText={text => props.onChangeText('email', text)}
          onSubmitEditing={() => passwordInputRef.current && passwordInputRef.current.focus()}
          editable={!props.isLoading}
          style={styles(theme).textField}
          returnKeyType="next"
          clearButtonMode="always"
          autoFocus
        />

        <InputGroupPassword
          textInputRef={passwordInputRef}
          testID="LoginForm-TextInput-password"
          value={props.password}
          onChangeText={(text: string) => props.onChangeText('password', text)}
          onSubmitEditing={() => props.onPressLogin()}
          editable={!props.isLoading}
          returnKeyType="done"
        />

        <View style={{ marginTop: spacing.default }}>
          <Button
            testID="LoginForm-Button-login"
            title="Login"
            loading={props.isLoading}
            onPress={props.onPressLogin}
            disabled={props.isLoading}
            activeOpacity={1}
          />
          <Button testID="LoginForm-Button-forgot-password" title="Forgot password?" type="clear" onPress={props.onPressForgotPassword} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

import React, { useContext, useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { Button } from '../Button';

import { placeholderTextcolor } from '../../constants/text-input';
import { UserThemeContext } from '../../contexts/UserThemeProvider';
import { InputGroup } from '../InputGroup';
import { InputGroupPassword } from '../InputGroup/password';
import Text from '../Text';
import styles from './styles';

interface Props {
  password: string;
  resetPasswordToken: string;
  isLoading: boolean;
  isSuccess: boolean | null;
  onChangeText(field: string, text: string): void;
  onPressUpdatePassword(): void;
}

export const LoginResetPasswordForm: React.FC<Props> = React.memo((props) => {
    const passwordInputRef = useRef<TextInput>(null);
    const { theme } = useContext(UserThemeContext);

    // Android and iOS both interact with this prop differently.
    // Android may behave better when given no behavior prop at all, whereas iOS is the opposite.
    // https://facebook.github.io/react-native/docs/keyboardavoidingview#behavior
    const behaviorOption = Platform.OS === 'ios' ? 'padding' : undefined;

    return (
      <KeyboardAvoidingView testID="LoginResetPasswordForm" style={styles(theme).container} keyboardVerticalOffset={60} behavior={behaviorOption} enabled>
        <ScrollView style={styles(theme).form} contentContainerStyle={styles(theme).formContent} keyboardShouldPersistTaps={'handled'}>
          <Text style={styles(theme).subtitle} preset="lead">Please check your e-mail's inbox for the password reset code and fill it in below.</Text>

          <InputGroup label="Reset password code">
            <TextInput
              testID="LoginResetPasswordForm-TextInput-reset-password-code"
              placeholder="A1B2C3"
              autoCapitalize="characters"
              value={props.resetPasswordToken}
              onChangeText={text => props.onChangeText('resetPasswordToken', text)}
              textContentType="username"
              onSubmitEditing={() => passwordInputRef.current && passwordInputRef.current.focus()}
              editable={!props.isLoading}
              style={styles(theme).textField}
              keyboardType="default"
              returnKeyType="next"
              clearButtonMode="always"
              autoFocus
              blurOnSubmit={false}
              placeholderTextColor={placeholderTextcolor(theme)}
            />
          </InputGroup>

          <InputGroupPassword
            textInputRef={passwordInputRef}
            testID="LoginResetPasswordForm-TextInput-password"
            value={props.password}
            onChangeText={(text: string) => props.onChangeText('password', text)}
            onSubmitEditing={() => props.onPressUpdatePassword()}
            editable={!props.isLoading}
            returnKeyType="done"
          />

          <View>
            <Button
              testID="LoginResetPasswordForm-Button-update-password"
              title={props.isSuccess ? 'Successfully changed password!' : 'Save new password'}
              loading={props.isLoading}
              onPress={props.onPressUpdatePassword}
              disabled={props.isLoading || !!props.isSuccess}
              activeOpacity={1}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
);

import React from 'react';
import { View, TextInput, KeyboardAvoidingView, ScrollView, Text } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './styles';

interface Props {
  onChangeText(field: string, text: string): void;
  onPressResetPassword(): void;
  onPressResetPasswordCode(): void;
  email: string;
  isLoading: boolean;
  isSuccess: boolean | null;
}

export const LoginForgotPasswordForm: React.FC<Props> = React.memo(({
  email,
  isLoading,
  isSuccess,
  onChangeText,
  onPressResetPassword,
  onPressResetPasswordCode
}) => {

  return (
    <KeyboardAvoidingView testID="login-form" style={styles.container} behavior="padding" enabled>
      <ScrollView style={styles.form} contentContainerStyle={styles.formContent} keyboardShouldPersistTaps={'handled'}>

        <TextInput
          placeholder="E-mail address"
          autoCapitalize="none"
          value={email}
          onChangeText={text => onChangeText('email', text)}
          textContentType="username"
          onSubmitEditing={() => onPressResetPassword()}
          style={styles.textField}
          keyboardType="email-address"
          returnKeyType="next"
          clearButtonMode="always"
          // autoFocus
          blurOnSubmit={false}
        />

        <View>
          {isSuccess && <Text>Success. Please check your e-mail!</Text>}
          <Button title="Reset my password" loading={isLoading} onPress={onPressResetPassword} disabled={isLoading} buttonStyle={styles.buttonStyle} disabledStyle={styles.buttonStyle} activeOpacity={1} titleStyle={styles.buttonTitleStyle} />
          <Button title="Already have reset password code?" type="clear" onPress={onPressResetPasswordCode} />
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
});

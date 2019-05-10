import React from 'react';
import { View, TextInput, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './styles';

interface Props {
  onChangeText(field: string, text: string): void;
  onPressUpdatePassword(): void;
  password: string;
  passwordValidation: string;
  isLoading: boolean;
  isSuccess: boolean;
}

export const UpdatePasswordForm: React.FC<Props> = React.memo(({
  onChangeText,
  onPressUpdatePassword,
  password,
  passwordValidation,
  isLoading,
  isSuccess
}) => (
  <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={100} enabled>
    <View style={styles.form}>

      <TextInput
        placeholder="Your new password"
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
        placeholder="Your new password again to validate"
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
        <Button
          title={(isSuccess) ? 'Update success!' : 'Update password'}
          loading={isLoading}
          onPress={onPressUpdatePassword}
          disabled={isLoading}
          buttonStyle={(isSuccess) ? styles.buttonStyleSuccess : styles.buttonStyle}
          titleStyle={(isSuccess) ? styles.buttonTitleStyleSuccess : {}}
          activeOpacity={1}
          disabledStyle={(isSuccess) ? styles.buttonStyleSuccess : styles.buttonStyle}
         />
      </View>

    </View>
  </KeyboardAvoidingView>
));

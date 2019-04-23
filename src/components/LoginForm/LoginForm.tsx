import React from 'react';
import { View, Text, TextInput, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './styles';

interface Props {
  onChangeText(field: string, text: string): void;
  onPressLogin(): void;
  onPressSignup(): void;
  email: string;
  password: string;
  error: string;
  isLoading: boolean;
}

export const LoginForm: React.FC<Props> = ({
  onChangeText,
  onPressLogin,
  onPressSignup,
  email,
  password,
  error,
  isLoading
}) => (
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
        autoFocus
        blurOnSubmit={false}
        // onSubmitEditing={() => focusNextField()}
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
        blurOnSubmit={false}
        // onSubmitEditing={() => focusNextField()}
      />

      {/* <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View> */}

      <View>
        <Button title="Login" loading={isLoading} onPress={onPressLogin} disabled={isLoading} buttonStyle={styles.buttonStyle} disabledStyle={styles.buttonStyle} activeOpacity={1} titleStyle={styles.buttonTitleStyle} />
        {/* <Button title="I don't have an account" type="clear" onPress={onPressSignup} titleStyle={{ color: 'gray', fontWeight: 'normal' }} /> */}
      </View>

    </View>
  </KeyboardAvoidingView>
);

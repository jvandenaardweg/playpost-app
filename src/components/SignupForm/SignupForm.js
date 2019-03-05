import React from 'react';
import {
  View, Text, TextInput
} from 'react-native';
import { Button } from 'react-native-elements';
// import PropTypes from 'prop-types';
import styles from './styles';

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
}) => (
  <View style={styles.container}>
    <View style={styles.form}>

      <TextInput
        placeholder="E-mail address"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => onChangeText('email', text)}
        style={styles.textField}
      />

      <TextInput
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry
        value={password}
        onChangeText={(text) => onChangeText('password', text)}
        textContentType="password"
        style={styles.textField}
      />

      <TextInput
        placeholder="Password validation"
        autoCapitalize="none"
        secureTextEntry
        value={passwordValidation}
        onChangeText={(text) => onChangeText('passwordValidation', text)}
        textContentType="password"
        style={styles.textField}
      />

      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{validationError || error}</Text>
      </View>

      <View>
        <Button title={isLoading ? 'Loading...' : 'Create account'} onPress={onPressSignup} disabled={isLoading} buttonStyle={styles.buttonStyle} titleStyle={styles.buttonTitleStyle} />
        <Button title="I already have an account" type="clear" onPress={onPressLogin} titleStyle={{ color: 'gray', fontSize: 16 }} />
      </View>

    </View>
  </View>
);

import React from 'react';
import {
  View, Text, TextInput
} from 'react-native';
import { Button } from 'react-native-elements';
// import PropTypes from 'prop-types';
import styles from './styles';

export const LoginForm = ({
  onChangeText,
  onPressLogin,
  onPressSignup,
  email,
  password,
  error,
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

      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>

      <View>
        <Button title={isLoading ? 'Loading...' : 'Login'} onPress={onPressLogin} disabled={isLoading} buttonStyle={styles.buttonStyle} titleStyle={styles.buttonTitleStyle} />
        <Button title="Signup" type="clear" onPress={onPressSignup} />
      </View>

    </View>
  </View>
);

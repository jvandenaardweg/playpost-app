import React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './styles';

interface Props {
  message: string;
  onPressClose(): void;
}

export const ErrorModal: React.FC<Props> = React.memo(({ message, onPressClose }) => (
  <View style={styles.container}>
    <View>
      <Text style={styles.messageText}>{message}</Text>
    </View>
    <View style={styles.footer}>
      <Button testID="ErrorModal-Button-close" title="Close" onPress={onPressClose} />
    </View>
  </View>
));

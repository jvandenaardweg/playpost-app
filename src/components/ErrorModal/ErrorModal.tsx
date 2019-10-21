import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './styles';

import Text from '../Text';

interface Props {
  message: string;
  onPressClose(): void;
}

export const ErrorModal: React.FC<Props> = React.memo((props) => (
  <View style={styles.container}>
    <View>
      <Text style={styles.messageText} preset="bodyEmphasized">{props.message}</Text>
    </View>
    <View style={styles.footer}>
      <Button testID="ErrorModal-Button-close" title="Close" onPress={props.onPressClose} />
    </View>
  </View>
));

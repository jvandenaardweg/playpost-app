import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Button } from '../Button';

import Text from '../Text';
import styles from './styles';

interface Props {
  isLoading: boolean;
  errorMessage: string;
  isSuccess: boolean;
  isError: boolean;
  onPressClose(): void;
}

export const ShareModal: React.FC<Props> = React.memo((props) => (
  <View style={styles.container}>
    <View style={styles.wrapper}>
      <View style={styles.articleContainer}>
        {props.isLoading && <ActivityIndicator size="small" color="black" />}
        {!props.isLoading && props.isError && <Text style={styles.errorMessage} preset="bodyEmphasized">{props.errorMessage}</Text>}
        {!props.isLoading && props.isSuccess && <Text style={styles.successMessage} preset="bodyEmphasized">Article is added to your playlist!</Text>}
      </View>
      <View style={styles.footer}>
        <Button testID="ShareModal-Button-close" title="Close" onPress={props.onPressClose} />
      </View>
    </View>
  </View>
));

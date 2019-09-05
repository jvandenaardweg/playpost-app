import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './styles';

interface Props {
  isLoading: boolean;
  errorMessage: string;
  isSuccess: boolean;
  isError: boolean;
  onPressClose(): void;
}

export const ShareModal: React.FC<Props> = React.memo(({ isLoading, errorMessage, isSuccess, isError, onPressClose }) => (
  <View style={styles.container}>
    <View style={styles.wrapper}>
      <View style={styles.articleContainer}>
        {isLoading && <ActivityIndicator size="small" color="black" />}
        {!isLoading && isError && <Text style={styles.errorMessage}>{errorMessage}</Text>}
        {!isLoading && isSuccess && <Text style={styles.successMessage}>Article is added to your playlist!</Text>}
      </View>
      <View style={styles.footer}>
        <Button testID="ShareModal-Button-close" title="Close" onPress={onPressClose} />
      </View>
    </View>
  </View>
));

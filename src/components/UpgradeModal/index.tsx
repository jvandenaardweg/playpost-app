import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modal';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import { Text } from '../Text';
import styles from './styles';

export interface Props {
  isActive: boolean;
  isEligibleForTrial: boolean;
  isSubscribed: boolean;
  trialUrgencyDate: string;
  totalAvailableVoices: number;
  onPressCancel(): void;
  onPressUpgrade(): void;
}

export const UpgradeModal: React.FC<Props> = React.memo(({
  isActive,
  onPressUpgrade,
  onPressCancel,
  isEligibleForTrial,
  isSubscribed,
  trialUrgencyDate,
  totalAvailableVoices
}) => (
  <Modal
    isVisible={isActive}
    useNativeDriver
    coverScreen
    animationInTiming={200}
    animationOutTiming={200}
    animationIn="zoomIn"
    animationOut="zoomOut"
    style={styles.modal}
  >
    <View style={styles.container}>
      <Text style={styles.title} testID="UpgradeModal-Text-title">Continue listening with high-quality voices</Text>

      {/*
        Contexts when the user could see this modal:
        - When a unsubscribed user has used all his free minutes for the current month
        - When a subscribed user has used all his free minutes for the current month
      */}

      {!isSubscribed && (
        <Text testID="UpgradeModal-Text-not-isSubscribed" style={styles.paragraph}>
          {`You have used your free minutes for this month. Upgrade now to continue listening using this voice or one of the ${totalAvailableVoices} other high-quality voices. Pick and choose the voice you like!\n\nWhen not upgrading, you will be set to use our lowest quality voices for the next month.`}
        </Text>
      )}

      {isSubscribed && (
        <Text testID="UpgradeModal-Text-isSubscribed" style={styles.paragraph}>
          {'You have used your last remaining audio minutes for your subscription this month.\n\nYou can continue listening by upgrading to a higher subscription plan.'}
        </Text>
      )}

      {/* {isEligibleForTrial && (
        <Text testID="UpgradeModal-Text-trial" style={[styles.paragraph, styles.paragraphBold]}>
          Continue listening, start your free trial before {trialUrgencyDate}.
        </Text>
      )} */}

      <View style={styles.footer}>
        {isSubscribed && <Button testID="UpgradeModal-Button-upgrade" title={'Continue listening'} onPress={onPressUpgrade} />}
        {!isSubscribed && <Button testID="UpgradeModal-Button-upgrade" title={isEligibleForTrial ? 'Start free trial' : 'Continue listening'} onPress={onPressUpgrade} />}
        <Button testID="UpgradeModal-Button-cancel" title={isSubscribed ? 'Close' : 'Cancel (use lowest quality voices)'} type="clear" onPress={onPressCancel} titleStyle={{ color: colors.grayDark, fontWeight: fonts.fontWeight.normal, fontSize: fonts.fontSize.body }} />
      </View>
    </View>
  </Modal>
));

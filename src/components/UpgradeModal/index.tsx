import React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modal';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import styles from './styles';

export interface Props {
  isActive: boolean;
  isEligibleForTrial: boolean;
  isSubscribed: boolean;
  useTrialUrgencyDate: string;
  totalAvailableVoices: number;
  onPressCancel(): void;
  onPressUpgrade(): void;
}

export const UpgradeModal: React.FC<Props> = React.memo(({ isActive, onPressUpgrade, onPressCancel, isEligibleForTrial, isSubscribed, useTrialUrgencyDate, totalAvailableVoices }) => (
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
      {!isSubscribed && <Text testID="UpgradeModal-Text-not-isSubscribed" style={styles.paragraph}>{`You have used your last free high-quality audio article and free minutes for this month.\n\n Upgrade to continue listening using this voice or one of the ${totalAvailableVoices} other high-quality voices. Pick and choose the voice you like!`}</Text>}
      {isSubscribed && <Text testID="UpgradeModal-Text-isSubscribed" style={styles.paragraph}>{'You have used your last remaining audio minutes for your subscription this month.\n\nContinue listening by upgrading to a higher subscription plan.'}</Text>}
      {isEligibleForTrial && <Text testID="UpgradeModal-Text-trial" style={[styles.paragraph, styles.paragraphBold]}>Continue listening, start your free trial before {useTrialUrgencyDate}.</Text>}
      <View style={styles.footer}>
        {isSubscribed && <Button testID="UpgradeModal-Button-upgrade" title={'Continue listening'} onPress={onPressUpgrade} />}
        {!isSubscribed && <Button testID="UpgradeModal-Button-upgrade" title={isEligibleForTrial ? 'Start free trial' : 'Upgrade to Premium or Plus'} onPress={onPressUpgrade} />}
        <Button testID="UpgradeModal-Button-cancel" title={isSubscribed ? 'Close' : 'Cancel (use lowest quality voice)'} type="clear" onPress={onPressCancel} titleStyle={{ color: colors.grayDark, fontWeight: fonts.fontWeight.normal, fontSize: fonts.fontSize.body }} />
      </View>
    </View>
  </Modal>
));

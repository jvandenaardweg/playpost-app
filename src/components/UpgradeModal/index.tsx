import React, { useContext } from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { Button } from '../Button';

import { UserThemeContext } from '../../contexts/UserThemeProvider';
import Text from '../Text';
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

export const UpgradeModal: React.FC<Props> = React.memo((props) => {
  const { theme } = useContext(UserThemeContext);

  return (
    <Modal
      isVisible={props.isActive}
      useNativeDriver
      coverScreen={false}
      hardwareAccelerated
      hasBackdrop
      animationInTiming={200}
      animationOutTiming={200}
      animationIn="zoomIn"
      animationOut="zoomOut"
      style={styles(theme).modal}
    >
      <View style={styles(theme).container}>
        <Text style={styles(theme).title} testID="UpgradeModal-Text-title" preset="title2Emphasized">Continue listening with high-quality voices</Text>

        {/*
          Contexts when the user could see this modal:
          - When a unsubscribed user has used all his free minutes for the current month
          - When a subscribed user has used all his free minutes for the current month
        */}

        {!props.isSubscribed && (
          <Text testID="UpgradeModal-Text-not-isSubscribed" style={styles(theme).paragraph} preset="subhead">
            {`You have used your free minutes for this month. Upgrade now to continue listening using this voice or one of the ${props.totalAvailableVoices} other high-quality voices. Pick and choose the voice you like!\n\nWhen not upgrading, you will be set to use our lowest quality voices from now on.`}
          </Text>
        )}

        {props.isSubscribed && (
          <Text testID="UpgradeModal-Text-isSubscribed" style={styles(theme).paragraph} preset="subhead">
            {'You have used your last remaining audio minutes for your subscription this month.\n\nYou can continue listening by upgrading to a higher subscription plan.'}
          </Text>
        )}

        {/* {isEligibleForTrial && (
          <Text testID="UpgradeModal-Text-trial" style={[styles(theme).paragraph, styles(theme).paragraphBold]}>
            Continue listening, start your free trial before {trialUrgencyDate}.
          </Text>
        )} */}

        <View style={styles(theme).footer}>
          {props.isSubscribed && (
            <Button
              testID="UpgradeModal-Button-upgrade"
              title={'Continue listening'}
              onPress={props.onPressUpgrade} />
          )}
          {!props.isSubscribed && (
            <Button
              testID="UpgradeModal-Button-upgrade"
              title={props.isEligibleForTrial ? 'Start free trial' : 'Continue listening'}
              onPress={props.onPressUpgrade}
            />
          )}
          <Button
            testID="UpgradeModal-Button-cancel"
            title={props.isSubscribed ? 'Close' : 'Cancel (use lowest quality voices)'}
            type="clear"
            onPress={props.onPressCancel}
            titleStyle={styles(theme).cancelTitle}
          />
        </View>
      </View>
    </Modal>
  )
});

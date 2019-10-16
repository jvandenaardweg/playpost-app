import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';

import colors from '../../constants/colors';
import { SUBSCRIPTION_PRODUCT_ID_FREE, SUBSCRIPTION_PRODUCT_ID_PREMIUM, SUBSCRIPTION_PRODUCT_ID_UNLIMITED } from '../../constants/in-app-purchase';
import Text from '../Text';
import styles from './styles';
import { UserThemeContext } from '../../contexts/UserThemeProvider';
import { useContext } from 'react';


export interface Props {
  user: Api.User | null;
  activeSubscriptionProductId: string;
  userIsEligibleForTrial: boolean;
  onPressUpgrade(upgradeScreenCenteredSubscriptionProductId?: string): void;
}

export const Usage: React.FC<Props> = React.memo(({ user, activeSubscriptionProductId, onPressUpgrade, userIsEligibleForTrial }) => {
  const { theme } = useContext(UserThemeContext)

  const limitSecondsPerMonth = (user) ? user.limits.audiofiles.limitSecondsPerMonth : null;
  const usageUsedCurrentMonthInSeconds = (user) ? user.used.audiofiles && user.used.audiofiles.currentMonthInSeconds : null;
  const percentageUsedCurrentMonth = (usageUsedCurrentMonthInSeconds !== null && limitSecondsPerMonth !== null) ? (usageUsedCurrentMonthInSeconds / limitSecondsPerMonth) * 100 : 0;
  const percentageUsed = percentageUsedCurrentMonth >= 100 ? 100 : percentageUsedCurrentMonth;

  const currentUsageLocalized = (usageUsedCurrentMonthInSeconds !== null) ? Math.ceil(usageUsedCurrentMonthInSeconds / 60).toLocaleString('nl-NL') : '?'; // So we have 5.000 (with a dot)
  const currentLimitLocalized = (limitSecondsPerMonth) ? Math.ceil(limitSecondsPerMonth / 60).toLocaleString('nl-NL') : (user) ? 'unlimited' : '?'; // So we have 5.000 (with a dot)

  const showUpgradeButton = activeSubscriptionProductId === SUBSCRIPTION_PRODUCT_ID_FREE || activeSubscriptionProductId === SUBSCRIPTION_PRODUCT_ID_PREMIUM;

  const upgradeButtonTitle = getUpgradeButtonTitle(activeSubscriptionProductId, userIsEligibleForTrial);
  const upgradeMessage = getUpgradeMessage(activeSubscriptionProductId);
  const usedText = `of ${currentLimitLocalized} minutes used this month`;
  const usedPercentageText = limitSecondsPerMonth ? `${Math.ceil(percentageUsed)}%` : '';
  const progressWidth = limitSecondsPerMonth ? `${percentageUsed}%` : '0%';
  const progressBackgroundColor = percentageUsed < 85 ? colors.black : colors.red;
  const percentageUsedColor = percentageUsed < 85 ? colors.black : colors.red;

  const upgradeScreenCenteredSubscriptionProductId =
    activeSubscriptionProductId === SUBSCRIPTION_PRODUCT_ID_PREMIUM
      ? SUBSCRIPTION_PRODUCT_ID_UNLIMITED
      : activeSubscriptionProductId === SUBSCRIPTION_PRODUCT_ID_FREE
      ? SUBSCRIPTION_PRODUCT_ID_PREMIUM
      : SUBSCRIPTION_PRODUCT_ID_PREMIUM;

  return (
    <View style={styles(theme).container}>
      <View style={styles(theme).wrapper}>
        <View style={styles(theme).statsContainer}>
          <View style={styles(theme).statsWrapper}>
            <View>
              <Text style={styles(theme).statsBigNumber} preset="largeTitleEmphasized" testID="Usage-Text-current-usage">{currentUsageLocalized}</Text>
            </View>
            <View style={styles(theme).statsNumbersContainer}>
              <View>
                <Text testID="Usage-Text-minutes-used" style={styles(theme).statsMeta} preset="footnote">{usedText}</Text>
              </View>
              <View>
                <Text testID="Usage-Text-percentage" style={{...styles(theme).statsPercentage, color: percentageUsedColor }} preset="bodyEmphasized">{usedPercentageText}</Text>
              </View>
            </View>
          </View>
          <View style={styles(theme).progressContainer}>
            <View testID="Usage-View-progress" style={[styles(theme).progress, { width: progressWidth }, { backgroundColor: progressBackgroundColor }]} />
          </View>
        </View>

        {showUpgradeButton && (
          <View style={styles(theme).upgradeContainer}>
            <Button
              testID="Usage-Button-upgrade"
              title={upgradeButtonTitle}
              onPress={() => onPressUpgrade(upgradeScreenCenteredSubscriptionProductId)}
            />
            <Text testID="Usage-Text-upgrade-message" style={styles(theme).messageText} preset="footnote">
              {upgradeMessage}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
});

export function getUpgradeMessage(activeSubscriptionProductId: string): string {
  if (activeSubscriptionProductId === SUBSCRIPTION_PRODUCT_ID_FREE) {
    return 'Upgrade for more minutes and Premium quality voices.';
  }

  if (activeSubscriptionProductId === SUBSCRIPTION_PRODUCT_ID_PREMIUM) {
    return 'Upgrade for unlimited minutes.'
  }

  return ''
}

export function getUpgradeButtonTitle(activeSubscriptionProductId: string, userIsEligibleForTrial: boolean): string {
  if (activeSubscriptionProductId === SUBSCRIPTION_PRODUCT_ID_FREE && userIsEligibleForTrial) {
    return 'Start free trial'
  }

  if (activeSubscriptionProductId === SUBSCRIPTION_PRODUCT_ID_FREE) {
    return 'Upgrade to Premium/Unlimited'
  }

  if (activeSubscriptionProductId === SUBSCRIPTION_PRODUCT_ID_PREMIUM) {
    return 'Upgrade to Unlimited'
  }

  return ''
}

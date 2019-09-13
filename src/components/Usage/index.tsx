import React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import colors from '../../constants/colors';
import { SUBSCRIPTION_PRODUCT_ID_FREE, SUBSCRIPTION_PRODUCT_ID_PLUS, SUBSCRIPTION_PRODUCT_ID_PREMIUM } from '../../constants/in-app-purchase';
import styles from './styles';


export interface Props {
  user: Api.User | null;
  activeSubscriptionProductId: string;
  userIsEligibleForTrial: boolean;
  onPressUpgrade(upgradeScreenCenteredSubscriptionProductId?: string): void;
}

export const Usage: React.FC<Props> = React.memo(({ user, activeSubscriptionProductId, onPressUpgrade, userIsEligibleForTrial }) => {
  if (!user) { return null; }

  const limitSecondsPerMonth = user.limits.audiofiles.limitSecondsPerMonth;
  const usageUsedCurrentMonthInSeconds = user.used.audiofiles && user.used.audiofiles.currentMonthInSeconds;
  const percentageUsedCurrentMonth = (usageUsedCurrentMonthInSeconds / limitSecondsPerMonth) * 100;
  const percentageUsed = percentageUsedCurrentMonth >= 100 ? 100 : percentageUsedCurrentMonth;

  const currentUsageLocalized = Math.ceil(usageUsedCurrentMonthInSeconds / 60).toLocaleString('nl-NL'); // So we have 5.000 (with a dot)
  const currentLimitLocalized = Math.ceil(limitSecondsPerMonth / 60).toLocaleString('nl-NL'); // So we have 5.000 (with a dot)

  const showUpgradeButton = activeSubscriptionProductId === SUBSCRIPTION_PRODUCT_ID_FREE || activeSubscriptionProductId === SUBSCRIPTION_PRODUCT_ID_PREMIUM;

  const upgradeButtonTitle = getUpgradeButtonTitle(activeSubscriptionProductId, userIsEligibleForTrial);
  const upgradeMessage = getUpgradeMessage(activeSubscriptionProductId);
  const usedText = `of ${currentLimitLocalized} minutes used this month`;
  const usedPercentageText = `${Math.ceil(percentageUsed)}%`;
  const progressWidth = `${percentageUsed}%`;

  const upgradeScreenCenteredSubscriptionProductId =
    activeSubscriptionProductId === SUBSCRIPTION_PRODUCT_ID_PREMIUM
      ? SUBSCRIPTION_PRODUCT_ID_PLUS
      : activeSubscriptionProductId === SUBSCRIPTION_PRODUCT_ID_FREE
      ? SUBSCRIPTION_PRODUCT_ID_PREMIUM
      : SUBSCRIPTION_PRODUCT_ID_PREMIUM;

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.statsContainer}>
          <View style={styles.statsWrapper}>
            <View>
              <Text style={styles.statsBigNumber}>{currentUsageLocalized}</Text>
            </View>
            <View style={styles.statsNumbersContainer}>
              <View>
                <Text testID="Usage-Text-minutes-used" style={styles.statsMeta}>{usedText}</Text>
              </View>
              <View>
                <Text testID="Usage-Text-percentage" style={styles.statsPercentage}>{usedPercentageText}</Text>
              </View>
            </View>
          </View>
          <View style={styles.progressContainer}>
            <View testID="Usage-View-progress" style={[styles.progress, { width: progressWidth }]} />
          </View>
        </View>

        {showUpgradeButton && (
          <View style={styles.upgradeContainer}>
            <Button
              testID="Usage-Button-upgrade"
              title={upgradeButtonTitle}
              titleStyle={{ color: colors.white }}
              buttonStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
              onPress={() => onPressUpgrade(upgradeScreenCenteredSubscriptionProductId)}
            />
            <Text testID="Usage-Text-upgrade-message" style={styles.messageText}>
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
    return 'Upgrade for nearly unlimited minutes.'
  }

  return ''
}

export function getUpgradeButtonTitle(activeSubscriptionProductId: string, userIsEligibleForTrial: boolean): string {
  if (activeSubscriptionProductId === SUBSCRIPTION_PRODUCT_ID_FREE && userIsEligibleForTrial) {
    return 'Start free Premium or Plus trial'
  }

  if (activeSubscriptionProductId === SUBSCRIPTION_PRODUCT_ID_FREE) {
    return 'Upgrade to Premium or Plus'
  }

  if (activeSubscriptionProductId === SUBSCRIPTION_PRODUCT_ID_PREMIUM) {
    return 'Upgrade to Plus'
  }

  return ''
}

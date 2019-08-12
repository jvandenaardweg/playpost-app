import React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import colors from '../../constants/colors';
import styles from './styles';


interface Props {
  user: Api.User | null;
  activeSubscriptionProductId: string;
  userHasSubscribedBefore: boolean;
  onPressUpgrade(upgradeScreenCenteredSubscriptionProductId?: string): void;
}

export const Usage: React.FC<Props> = React.memo(({ user, activeSubscriptionProductId, onPressUpgrade, userHasSubscribedBefore }) => {
  if (!user) { return null; }

  const limitSecondsPerMonth = user.limits.audiofiles.limitSecondsPerMonth;
  const usageUsedCurrentMonthInSeconds = user.used.audiofiles && user.used.audiofiles.currentMonthInSeconds;
  const percentageUsedCurrentMonth = (usageUsedCurrentMonthInSeconds / limitSecondsPerMonth) * 100;
  const percentageUsed = percentageUsedCurrentMonth >= 100 ? 100 : percentageUsedCurrentMonth;

  const currentUsageLocalized = Math.ceil(usageUsedCurrentMonthInSeconds / 60).toLocaleString('nl-NL'); // So we have 5.000 (with a dot)
  const currentLimitLocalized = Math.ceil(limitSecondsPerMonth / 60).toLocaleString('nl-NL'); // So we have 5.000 (with a dot)

  const showUpgradeButton = activeSubscriptionProductId === 'free' || activeSubscriptionProductId === 'com.aardwegmedia.playpost.premium';

  const upgradeButtonTitle = getUpgradeButtonTitle(activeSubscriptionProductId, userHasSubscribedBefore);
  const upgradeMessage = getUpgradeMessage(activeSubscriptionProductId);
  const usedText = `of ${currentLimitLocalized} minutes used`;
  const usedPercentageText = `${Math.ceil(percentageUsed)}%`;
  const progressWidth = `${percentageUsed}%`;

  const upgradeScreenCenteredSubscriptionProductId =
    activeSubscriptionProductId === 'com.aardwegmedia.playpost.premium'
      ? 'com.aardwegmedia.playpost.subscription.plus'
      : activeSubscriptionProductId === 'free'
      ? 'com.aardwegmedia.playpost.premium'
      : 'com.aardwegmedia.playpost.premium';

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
  if (activeSubscriptionProductId === 'free') {
    return 'Upgrade for more minutes and Premium quality voices.';
  }

  if (activeSubscriptionProductId === 'com.aardwegmedia.playpost.premium') {
    return 'Upgrade for nearly unlimited minutes.'
  }

  return ''
}

export function getUpgradeButtonTitle(activeSubscriptionProductId: string, userHasSubscribedBefore: boolean): string {
  if (activeSubscriptionProductId === 'free' && !userHasSubscribedBefore) {
    return 'Start free Premium or Plus trial'
  }

  if (activeSubscriptionProductId === 'free') {
    return 'Upgrade to Premium or Plus'
  }

  if (activeSubscriptionProductId === 'com.aardwegmedia.playpost.premium') {
    return 'Upgrade to Plus'
  }

  return ''
}

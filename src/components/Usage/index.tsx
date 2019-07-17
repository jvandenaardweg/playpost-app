import React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import styles from './styles';


interface Props {
  user: Api.User | null;
  activeSubscriptionProductId: string;
  activeSubscriptionName: string;
  onPressUpgrade(upgradeScreenCenteredSubscriptionProductId?: string): void;
}

export const Usage: React.FC<Props> = React.memo(({ user, activeSubscriptionProductId, onPressUpgrade, activeSubscriptionName }) => {
  if (!user) { return null; }

  const limitSecondsPerMonth = user.limits.audiofiles.limitSecondsPerMonth;
  const usageUsedCurrentMonthInSeconds = user.used.audiofiles && user.used.audiofiles.currentMonthInSeconds;
  const percentageUsedCurrentMonth = (usageUsedCurrentMonthInSeconds / limitSecondsPerMonth) * 100;
  const percentageUsed = percentageUsedCurrentMonth >= 100 ? 100 : percentageUsedCurrentMonth;

  const currentUsageLocalized = Math.ceil(usageUsedCurrentMonthInSeconds).toLocaleString('nl-NL'); // So we have 5.000 (with a dot)
  const currentLimitLocalized = Math.ceil(limitSecondsPerMonth).toLocaleString('nl-NL'); // So we have 5.000 (with a dot)

  const showUpgradeButton = activeSubscriptionProductId === 'free' || activeSubscriptionProductId === 'com.aardwegmedia.playpost.premium';

  const upgradeButtonTitle =
    activeSubscriptionProductId === 'com.aardwegmedia.playpost.premium'
      ? 'Upgrade to Plus'
      : activeSubscriptionProductId === 'free'
      ? 'Upgrade to Premium or Plus'
      : 'Upgrade';

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
                <Text style={styles.statsMeta}>of {currentLimitLocalized} minutes used</Text>
              </View>
              <View>
                <Text style={styles.statsPercentage}>{Math.ceil(percentageUsed)}%</Text>
              </View>
            </View>
          </View>
          <View style={styles.progressContainer}>
            <View style={[styles.progress, { width: `${percentageUsed}%` }]} />
          </View>
        </View>

        {showUpgradeButton && (
          <View style={styles.upgradeContainer}>
            <Button
              title={upgradeButtonTitle}
              titleStyle={{ color: colors.white }}
              buttonStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
              onPress={() => onPressUpgrade(upgradeScreenCenteredSubscriptionProductId)}
            />
            <Text style={{ marginTop: 8, color: colors.white, opacity: 0.7, textAlign: 'center', fontSize: fonts.fontSize.small }}>
              Upgrade for more minutes and Premium quality voices.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
});

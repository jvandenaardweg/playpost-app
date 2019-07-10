import React from 'react';
import { View, Text } from 'react-native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import { Button } from 'react-native-elements';
import styles from './styles';

interface Props {
  user: Api.User | null;
  activeSubscriptionProductId: string;
  activeSubscriptionName: string;
  onPressUpgrade(upgradeScreenCenteredSubscriptionProductId?: string): void;
}

export const Usage: React.FC<Props> = React.memo(({ user, activeSubscriptionProductId, onPressUpgrade, activeSubscriptionName }) => {
  if (!user) return null;

  const limitSecondsPerMonth = user.limits.audiofiles.limitSecondsPerMonth;
  const usageUsedCurrentMonthInSeconds = user.used.audiofiles && user.used.audiofiles.currentMonthInSeconds;
  // const usageAvailableCurrentMonthInSeconds = user.available.audiofiles && user.available.audiofiles.currentMonthInSeconds;
  const percentageUsed = (usageUsedCurrentMonthInSeconds / limitSecondsPerMonth) * 100;

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
        {/* <View style={styles.header}>
          <Text style={styles.headerTitle}>Usage ({activeSubscriptionName})</Text>
        </View> */}
        <View style={styles.statsContainer}>
          {/* <Text style={styles.statsTitle}>Article Audio Minutes</Text> */}
          <View style={styles.statsWrapper}>
            <View>
              <Text style={styles.statsBigNumber}>{Math.floor(usageUsedCurrentMonthInSeconds)}</Text>
            </View>
            <View style={styles.statsNumbersContainer}>
              <View>
                {/* <Text style={styles.statsMeta}>({Math.ceil(usageAvailableCurrentMonthInSeconds)} minutes available)</Text> */}
                <Text style={styles.statsMeta}>of {Math.ceil(limitSecondsPerMonth)} minutes used</Text>
              </View>
              <View>
                <Text style={styles.statsPercentage}>{Math.ceil(percentageUsed)}%</Text>
              </View>
            </View>
          </View>
          <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', height: 8, borderRadius: 8, overflow: 'hidden', marginTop: 6 }}>
            <View style={{ backgroundColor: colors.white, height: 8, borderRadius: 8, width: `${percentageUsed}%` }} />
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

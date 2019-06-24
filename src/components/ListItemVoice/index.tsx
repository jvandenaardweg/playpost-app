import React from 'react';
import { ListItem } from 'react-native-elements';

import colors from '../../constants/colors';
import * as Icon from '../../components/Icon';

import styles from './styles';
import { View, ActivityIndicator } from 'react-native';
import { ButtonVoicePreview } from '../ButtonVoicePreview';

interface Props {
  voice: Api.Voice;
  isSelected: boolean;
  isLoadingSaveSelected: boolean;
  isPlaying: boolean;
  isActive: boolean;
  isAvailable: boolean;
  isLoadingVoicePreview: boolean;
  onPressSelect(voice: Api.Voice): void;
  onPressPreview(title: string, label: string, voice: Api.Voice): void;
}

export const ListItemVoice: React.FC<Props> = React.memo(({
  voice,
  isSelected,
  isLoadingSaveSelected,
  isPlaying,
  isActive,
  isAvailable,
  isLoadingVoicePreview,
  onPressSelect,
  onPressPreview
}) => {
  const title = `${voice.label || voice.name}`;
  const badgeValue = getBadgeValue(voice.isPremium, voice.isHighestQuality);
  const defaultLabel = (voice.isLanguageDefault) ? '(Default) ' : '';
  const gender = (voice.gender === 'MALE') ? 'Male' : 'Female';
  const subtitle = `${defaultLabel}${gender}, ${voice.language.name} (${voice.countryCode})`;

  const label = (voice.label) ? voice.label : 'Unknown';
  const badgeStatus = (voice.isPremium) ? 'warning' : 'primary';

  return (
    <ListItem
      bottomDivider
      title={title}
      subtitle={subtitle}
      onPress={() => onPressSelect(voice)}
      badge={{ value: badgeValue, status: badgeStatus, textStyle: styles.listItemBadgeText, badgeStyle: styles.listItemBadge }}
      containerStyle={[styles.listItemContainer, (isSelected) ? { backgroundColor: colors.grayLightest } : {}]}
      titleStyle={styles.listItemTitle}
      subtitleStyle={styles.listItemSubtitle}
      leftElement={
        <ButtonVoicePreview
          isPlaying={isPlaying}
          isLoading={isLoadingVoicePreview}
          isActive={isActive}
          isAvailable={isAvailable}
          onPress={() => onPressPreview(title, label, voice)}
        />
      }
      rightElement={renderRightElement(isLoadingSaveSelected, isSelected)}
    />
  );

  function renderRightElement(isLoadingSaveSelected: boolean, isSelected: boolean) {
    if (isLoadingSaveSelected) return <View style={{ width: 20 }}><ActivityIndicator size="small" color="black" /></View>;

    return <View style={{ width: 20 }}><Icon.FontAwesome5 name="check" size={16} solid color={(isSelected) ? colors.black : colors.grayLightest} /></View>;
  }

  function getBadgeValue(isPremium: boolean, isHighestQuality: boolean) {
    if (isPremium && isHighestQuality) {
      return 'premium (hq)';
    }

    if (isPremium) {
      return 'premium';
    }

    return 'free';
  }
});

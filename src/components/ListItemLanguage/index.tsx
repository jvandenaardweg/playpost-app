import React from 'react';
import { ListItem } from 'react-native-elements';

import colors from '../../constants/colors';

import * as Icon from '../../components/Icon';

import styles from './styles';

interface Props {
  language: Api.Language;
  subtitle: string;
  totalVoices: number;
  onPress(language: Api.Language): void;
}

export const ListItemLanguage: React.FC<Props> = React.memo(({ language, subtitle, totalVoices, onPress }) => {
  return (
    <ListItem
      bottomDivider
      onPress={() => onPress(language)}
      title={language.name}
      subtitle={subtitle}
      containerStyle={styles.listItemContainer}
      badge={{
        value: totalVoices,
        badgeStyle: styles.badgeStyle,
        textStyle: styles.badgeTextStyle
      }}
      titleStyle={styles.listItemTitle}
      subtitleStyle={styles.listItemSubtitle}
      rightElement={<Icon.FontAwesome5 name="chevron-right" size={16} solid color={colors.gray} />}
    />
  );
});

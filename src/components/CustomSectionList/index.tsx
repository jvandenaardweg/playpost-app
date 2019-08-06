import React from 'react';
import { ActivityIndicator, SectionList, SectionListData, Text, TouchableHighlight, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import styles from './styles';

import colors from '../../constants/colors';

import * as Icon from '../../components/Icon';
import fonts from '../../constants/fonts';
import { EmptyState } from '../EmptyState';
import { ListSeperator } from '../ListSeperator';

export interface ListItem {
  subtitle?: string;
  title?: string;
  icon?: string;
  iconColor?: string;
  value?: number;
  chevron?: boolean;
  checkmark?: boolean;
  isSelected?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ComponentType<any> | React.ReactElement;
  rightIconColor?: string;
  onPress?(): void;
}

export interface CustomSectionListSectionData {
  title?: string;
  data: ListItem[];
}

interface Props {
  paddingTop?: number;
  sectionListData: ReadonlyArray<SectionListData<any>>;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
  emptyTitle?: string;
  emptyDescription?: string[];
}

export const CustomSectionList: React.FC<Props> = React.memo(({ sectionListData, ListHeaderComponent, ListFooterComponent, paddingTop, emptyTitle, emptyDescription }) => (
  <View style={styles.container}>
    <SectionList
      ListEmptyComponent={<EmptyState title={emptyTitle ? emptyTitle : "No items to show"} description={emptyDescription ? emptyDescription : ['It seems like this list is empty...']} />}
      contentContainerStyle={styles.containerStyle}
      initialNumToRender={15}
      keyExtractor={(item, index) => item.key}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      stickySectionHeadersEnabled={false}
      ItemSeparatorComponent={() => <View style={styles.itemSeperator}><ListSeperator /></View>}
      renderSectionFooter={() => <View style={styles.sectionFooter} />}
      renderItem={({ item, index, section }) => {
        const totalSectionItems = section.data.length;
        const lastIndex = totalSectionItems - 1;

        // styles
        const firstItemStyles = (index === 0) ? styles.listItemContainerBorderTopRadius : undefined;
        const lastItemStyles = (index === lastIndex) ? styles.listItemContainerBorderBottomRadius : undefined;
        const containerStyle = (item.isSelected) ? { backgroundColor: colors.tintColor } : undefined;
        const titleStyle = (item.isSelected) ? { color: colors.white } : { fontSize: fonts.fontSize.title };
        const subtitleStyle = (item.isSelected) ? { color: 'rgba(255, 255, 255, 0.7)' } : { fontSize: fonts.fontSize.small };
        const rightIconTextStyles = [styles.rightIconText, item.isSelected ? { color: colors.white } : undefined, item.rightIconColor && !item.isSelected ? { color: item.rightIconColor } : undefined];

        // colors
        const leftIconColor = item.iconColor ? item.iconColor : colors.black;
        const rightElementIconColor = item.isSelected ? colors.white : colors.grayLight;

        // props
        const subtitle = (item.subtitle) ? item.subtitle : undefined;

        // elements
        const leftIcon = (item.leftIcon) ? (item.leftIcon) : (item.icon) ? <Icon.Feather name={item.icon} size={20} color={leftIconColor} /> : undefined;
        const rightIcon = (item.isLoading) ? <ActivityIndicator /> : (item.value) ? <Text style={rightIconTextStyles}>{item.value}</Text> : undefined;
        const rightElement = (item.chevron) ? <Icon.FontAwesome5 name="chevron-right" size={16} color={colors.gray} /> : (item.checkmark) ? <Icon.FontAwesome5 name="check" size={16} color={rightElementIconColor} /> : undefined;

        return (
          <View style={[styles.listItemContainer, firstItemStyles, lastItemStyles]}>
            {/* // @ts-ignore
            // TODO: remove ts-ignore when react-native-elements is at version 1.2.0
            // https://github.com/react-native-training/react-native-elements/pull/1961
            // https://github.com/react-native-training/react-native-elements/issues/1842#issuecomment-511230772 */}
            <ListItem
              Component={TouchableHighlight}
              title={item.title}
              onPress={item.onPress}
              containerStyle={containerStyle}
              titleStyle={titleStyle}
              subtitleStyle={subtitleStyle}
              subtitle={subtitle}
              leftIcon={leftIcon}
              rightIcon={rightIcon}
              rightElement={rightElement}
            />
          </View>
        );
      }}
      sections={sectionListData}
    />
  </View>
));

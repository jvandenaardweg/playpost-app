import React from 'react';
import { ActivityIndicator, SectionList, SectionListData, TouchableHighlight, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import styles from './styles';

import colors from '../../constants/colors';
import { Text, textPresets } from '../Text';

import * as Icon from '../../components/Icon';
import { EmptyState } from '../EmptyState';
import { ListSeperator } from '../ListSeperator';

export interface IListItem {
  key: string;
  subtitle?: string;
  title?: string;
  icon?: string;
  iconColor?: string;
  value?: number | string;
  chevron?: boolean;
  checkmark?: boolean;
  isSelected?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactElement;
  rightIconColor?: string;
  onPress?(): void;
}

export interface ICustomSectionListSectionData {
  key: string;
  title?: string;
  data: IListItem[];
}

interface Props {
  paddingTop?: number;
  sectionListData: ReadonlyArray<SectionListData<IListItem>>;
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
      renderItem={({ item, index, section }: { item: IListItem, index: number, section: any }) => {
        // colors
        const leftIconColor = item.iconColor ? item.iconColor : colors.black;
        const checkmarkColor = item.isSelected ? colors.white : colors.grayLight;

        // styles
        const containerStyle = (item.isSelected) ? { backgroundColor: colors.tintColor } : undefined;
        const titleStyle = (item.isSelected) ? { color: colors.white } : { color: colors.black };
        const subtitleStyle = (item.isSelected) ? { color: 'rgba(255, 255, 255, 0.7)' } : undefined;
        const rightIconTextStyles = [styles.rightIconText, item.isSelected ? { color: colors.white } : undefined, item.rightIconColor && !item.isSelected ? { color: item.rightIconColor } : undefined];

        // props
        const subtitle = (item.subtitle) ? item.subtitle : undefined;

        // elements
        const leftIcon = (item.leftIcon) ? (item.leftIcon) : (item.icon)
          ? (
            <View style={{...styles.listItemLeftIconContainer, backgroundColor: leftIconColor }}>
              <Icon.Feather name={item.icon} size={14} color='white' style={styles.listItemLeftIcon} />
            </View>
          ) :
            undefined;

        const rightIcon = (item.value) ? <Text style={rightIconTextStyles} preset="footnoteEmphasized">{item.value}</Text> : undefined;
        const rightElement = getRightElement(item, checkmarkColor);

        return (
          <ListItem
            Component={TouchableHighlight}
            title={item.title}
            onPress={item.onPress}
            containerStyle={containerStyle}
            titleStyle={[titleStyle, textPresets['body']]}
            subtitleStyle={[subtitleStyle, textPresets['footnote'], { color: colors.grayDark }]}
            subtitle={subtitle}
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            rightElement={rightElement}
          />
        );
      }}
      sections={sectionListData}
    />
  </View>
));



const getRightElement = (item: IListItem, checkmarkColor: string) => {
  if (item.isLoading) {
    return <ActivityIndicator color={colors.black} />;
  }

  if (item.chevron) {
    return <Icon.Feather name="chevron-right" size={20} color={colors.gray} style={{ height: 20 }} />;
  }

  if (item.checkmark) {
    return <Icon.Feather name="check" size={20} color={checkmarkColor} style={{ height: 20 }} />
  }

  return undefined;
}

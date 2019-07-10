import React from 'react';
import { View, Text, SectionList, ActivityIndicator, SectionListData } from 'react-native';
import { ListItem } from 'react-native-elements';
import styles from './styles';

import colors from '../../constants/colors';

import { ListSeperator } from '../ListSeperator';
import * as Icon from '../../components/Icon';

export type ListItem = {
  subtitle?: string;
  title?: string;
  icon?: string;
  iconColor?: string;
  onPress?(): void;
  value?: number;
  chevron?: boolean;
  checkmark?: boolean;
  isSelected?: boolean;
  isLoading?: boolean;
  // tslint:disable-next-line: no-any
  leftIcon?: React.ComponentType<any> | React.ReactElement;
};

export type CustomSectionListSectionData = {
  title?: string;
  data: ListItem[];
};

type Props = {
  // tslint:disable-next-line: no-any
  sectionListData: ReadonlyArray<SectionListData<any>>;
  // tslint:disable-next-line: no-any
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  // tslint:disable-next-line: no-any
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
};

export const CustomSectionList: React.FC<Props> = ({ sectionListData, ListHeaderComponent, ListFooterComponent }) => (
  <View style={styles.container}>
    <SectionList
      keyExtractor={(item, index) => item + index}
      style={styles.sectionList}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      stickySectionHeadersEnabled={false}
      ItemSeparatorComponent={() => <ListSeperator />}
      SectionSeparatorComponent={() => <View style={styles.seperator} />}
      renderItem={({ item, index, section }) => {
        const totalSectionItems = section.data.length;
        const lastIndex = totalSectionItems - 1;

        return (
          <ListItem
            title={item.title}
            onPress={item.onPress}
            containerStyle={{
              ...(item.isSelected ? { backgroundColor: colors.tintColor } : undefined),
              ...(index === 0 ? { borderTopLeftRadius: 8, borderTopRightRadius: 8 } : undefined),
              ...(index === lastIndex ? { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 } : undefined)
            }}
            titleStyle={{
              ...(item.isSelected ? { color: colors.white } : undefined)
            }}
            subtitleStyle={{
              ...(item.isSelected ? { color: 'rgba(255, 255, 255, 0.5)' } : undefined)
            }}
            subtitle={item.subtitle ? item.subtitle : undefined}
            leftIcon={
              item.leftIcon ? (
                item.leftIcon
              ) : item.icon ? (
                <Icon.Feather name={item.icon} size={20} color={item.iconColor ? item.iconColor : colors.black} />
              ) : (
                undefined
              )
            }
            rightIcon={
              item.isLoading ? (
                <ActivityIndicator />
              ) : item.value ? (
                <Text style={[styles.rightIconText, item.isSelected ? { color: 'rgba(255, 255, 255, 0.5)' } : undefined]}>{item.value}</Text>
              ) : (
                undefined
              )
            }
            rightElement={
              item.chevron ? (
                <Icon.FontAwesome5 name="chevron-right" size={16} color={colors.gray} />
              ) : item.checkmark ? (
                <Icon.FontAwesome5 name="check" size={16} color={item.isSelected ? colors.white : colors.grayLight} />
              ) : (
                undefined
              )
            }
          />
        );
      }}
      sections={sectionListData}
    />
  </View>
);

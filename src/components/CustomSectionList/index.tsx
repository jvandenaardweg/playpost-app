import React from 'react';
import { ActivityIndicator, SectionList, SectionListData, Text, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import styles from './styles';

import colors from '../../constants/colors';

import * as Icon from '../../components/Icon';
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
}

export const CustomSectionList: React.FC<Props> = ({ sectionListData, ListHeaderComponent, ListFooterComponent, paddingTop }) => (
  <View style={[styles.container, (paddingTop !== undefined) ? { paddingTop } : undefined]}>
    <SectionList
      keyExtractor={(item, index) => item + index}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      stickySectionHeadersEnabled={false}
      ItemSeparatorComponent={() => <ListSeperator />}
      renderSectionFooter={() => <View style={styles.seperator} />}
      renderItem={({ item, index, section }) => {
        const totalSectionItems = section.data.length;
        const lastIndex = totalSectionItems - 1;

        return (
          // @ts-ignore
          // TODO: remove ts-ignore when react-native-elements is at version 1.2.0
          // https://github.com/react-native-training/react-native-elements/pull/1961
          // https://github.com/react-native-training/react-native-elements/issues/1842#issuecomment-511230772
          <ListItem
            title={item.title}
            onPress={item.onPress}
            underlayColor={'transparent'}
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
                <Text style={[styles.rightIconText, item.isSelected ? { color: 'rgba(255, 255, 255, 0.5)' } : undefined, item.rightIconColor ? { color: item.rightIconColor } : undefined]}>{item.value}</Text>
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

import React, { useContext } from 'react';
import isEqual from 'react-fast-compare';
import { ActivityIndicator, SectionList, SectionListData, TouchableHighlight, View } from 'react-native';
import { ListItem } from 'react-native-elements';

import styles from './styles';

import colors from '../../constants/colors';
import Text, { textPresets } from '../Text';

import * as Icon from '../../components/Icon';
import spacing from '../../constants/spacing';
import { UserThemeContext } from '../../contexts/UserThemeProvider';
import { UserTheme } from '../../reducers/user';
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

interface RightElementProps {
  isLoading?: boolean;
  chevron?: boolean;
  checkmark?: boolean;
  checkmarkColor: string;
  theme: UserTheme;
}

const ListItemRightElement: React.FC<RightElementProps> = React.memo((props) => {
  if (props.isLoading) {
    return <ActivityIndicator color={props.theme === UserTheme.dark ? colors.white : colors.black} />;
  }

  if (props.checkmark) {
    return <Icon.Feather name="check" size={20} color={props.checkmarkColor} style={{ height: 20 }} />
  }

  return <Icon.Feather name="chevron-right" size={20} color={props.theme === UserTheme.dark ? colors.gray500 : colors.gray} style={{ height: 20 }} />;
})

export const CustomSectionList: React.FC<Props> = React.memo((props) => {
  const { theme } = useContext(UserThemeContext)

  return (
    <SectionList
      ListEmptyComponent={<EmptyState title={props.emptyTitle ? props.emptyTitle : 'No items to show'} description={props.emptyDescription ? props.emptyDescription : ['It seems like this list is empty...']} />}
      contentContainerStyle={styles(theme).containerStyle}
      initialNumToRender={15}
      indicatorStyle={theme === UserTheme.dark ? 'white' : 'black'}
      keyExtractor={(item, index) => item.key}
      ListHeaderComponent={props.ListHeaderComponent && (
        <View style={{ marginLeft: spacing.default * -1, marginRight: spacing.default * -1, marginBottom: spacing.small }}>
          {props.ListHeaderComponent}
        </View>
      )}
      ListFooterComponent={props.ListFooterComponent}
      stickySectionHeadersEnabled={false}
      ItemSeparatorComponent={() => <View style={styles(theme).itemSeperator}><ListSeperator /></View>}
      renderSectionFooter={() => <View style={styles(theme).sectionFooter} />}
      renderItem={({ item, index, section }: { item: IListItem, index: number, section: any }) => {
        // colors
        const leftIconColor = item.iconColor ? item.iconColor : colors.black;
        const checkmarkColor = item.isSelected ? colors.white : (theme === UserTheme.dark) ? colors.gray600 : colors.gray;

        // styles
        const containerStyle = (item.isSelected) ? { backgroundColor: colors.tintColor } : theme === UserTheme.dark ? { backgroundColor: colors.gray900 } : { backgroundColor: colors.white };
        const titleStyle = (item.isSelected) ? { color: colors.white } : theme === UserTheme.dark ? { color: colors.white, opacity: 0.9 } : { color: colors.black };
        const subtitleStyle = (item.isSelected) ? { color: 'rgba(255, 255, 255, 0.7)' } : theme === UserTheme.dark ? { color: colors.gray400 } : { color: colors.gray100 };
        const rightIconTextStyles = [styles(theme).rightIconText, item.isSelected ? { color: colors.white } : undefined, item.rightIconColor && !item.isSelected ? { color: item.rightIconColor } : undefined];

        // props
        const subtitle = (item.subtitle) ? item.subtitle : undefined;

        // elements
        const leftIcon = (item.leftIcon) ? (item.leftIcon) : (item.icon)
          ? (
            <View style={{...styles(theme).listItemLeftIconContainer, backgroundColor: leftIconColor }}>
              <Icon.Feather name={item.icon} size={14} color="white" style={styles(theme).listItemLeftIcon} />
            </View>
          ) :
            undefined;

        const rightIcon = (item.value) ? <Text style={rightIconTextStyles} preset="subhead">{item.value}</Text> : undefined;

        return (
          <ListItem
            key={item.key}
            Component={TouchableHighlight}
            title={item.title}
            onPress={item.onPress}
            containerStyle={containerStyle}
            titleStyle={[titleStyle, textPresets['callout']]}
            subtitleStyle={[subtitleStyle, textPresets['footnote']]}
            subtitle={subtitle}
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            rightElement={<ListItemRightElement isLoading={item.isLoading} chevron={item.chevron} checkmark={item.checkmark} checkmarkColor={checkmarkColor} theme={theme} />}
          />
        );
      }}
      sections={props.sectionListData}
    />
  )
}, isEqual)

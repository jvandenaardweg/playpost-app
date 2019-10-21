
import React, { useContext } from 'react';
import { ScrollView, View } from 'react-native';
import Text from '../Text';

import styles from './styles';

import colors from '../../constants/colors';
import { UserThemeContext } from '../../contexts/UserThemeProvider';
import { UserTheme } from '../../reducers/user';
import { ButtonTiny } from '../ButtonTiny';
import * as Icon from '../Icon';

interface Filter {
  label: string;
  options: string[];
  selectedOption: string;
  onSelect(option: string): void;
}

interface Props {
  filters: Filter[]
}

export const TopFilter: React.FC<Props> = React.memo((props) => {
  const { theme } = useContext(UserThemeContext)

  return (
    <View>
      {props.filters.map((filter, filterIndex) => (
        <View style={styles(theme).filterContainer} key={filterIndex}>
          <Text style={styles(theme).filterLabel} preset="footnoteEmphasized" testID="TopFilter-Text-label">{filter.label}</Text>
          <ScrollView
            contentContainerStyle={styles(theme).scrollView}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            decelerationRate={0}
            testID="TopFilter-ScrollView"
          >

            {filter.options.map(optionLabel => {
              const isSelected = filter.selectedOption === optionLabel;
              const backgroundColor = (isSelected) ? colors.tintColorLight : (theme === UserTheme.dark) ? colors.gray600 : colors.grayLightest;
              const labelColor = (isSelected) ? colors.tintColor : (theme === UserTheme.dark) ? colors.white : colors.black;
              const iconElement = (isSelected) ? <Icon.FontAwesome5 name="check" solid size={10} color={colors.tintColor} /> : undefined;

              return (
                <View style={styles(theme).filterOption} key={optionLabel} testID="TopFilter-View-ButtonTiny-container">
                  <ButtonTiny
                    label={optionLabel}
                    backgroundColor={backgroundColor}
                    labelColor={labelColor}
                    onPress={() => filter.onSelect(optionLabel)}
                    IconElement={iconElement}
                  />
                </View>
              )
            })}
          </ScrollView>
        </View>
      ))}
    </View>
  )
})

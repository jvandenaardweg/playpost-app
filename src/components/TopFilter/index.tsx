
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import styles from './styles';

import * as Icon from '../Icon';
import colors from '../../constants/colors';
import { ButtonTiny } from '../ButtonTiny';

interface Filter {
  label: string;
  options: string[];
  selectedOption: string;
  onSelect(option: string): void;
}

interface Props {
  filters: Filter[]
}

export const TopFilter: React.FC<Props> = React.memo(({ filters }) => (
<View>
  <View>
    {filters.map(filter => (
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>{filter.label}</Text>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          decelerationRate={0}
        >

          {filter.options.map(optionLabel => {
            const isSelected = filter.selectedOption === optionLabel;
            const backgroundColor = (isSelected) ? colors.tintColor : colors.grayLightest;
            const labelColor = (isSelected) ? colors.white : colors.black;
            const iconElement = (isSelected) ? <Icon.FontAwesome5 name="check" solid size={10} color={colors.white} /> : undefined;

            return (
              <View style={styles.filterOption}>
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
</View>
));

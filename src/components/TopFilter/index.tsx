
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '../Text';

import styles from './styles';

import colors from '../../constants/colors';
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

export const TopFilter: React.FC<Props> = React.memo(({ filters }) => (
<View>
  <View>
    {filters.map((filter, filterIndex) => (
      <View style={styles.filterContainer} key={filterIndex}>
        <Text style={styles.filterLabel} testID="TopFilter-Text-label">{filter.label}</Text>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          decelerationRate={0}
          testID="TopFilter-ScrollView"
        >

          {filter.options.map(optionLabel => {
            const isSelected = filter.selectedOption === optionLabel;
            const backgroundColor = (isSelected) ? colors.tintColorLight : colors.grayLightest;
            const labelColor = (isSelected) ? colors.tintColor : colors.black;
            const iconElement = (isSelected) ? <Icon.FontAwesome5 name="check" solid size={10} color={colors.tintColor} /> : undefined;

            return (
              <View style={styles.filterOption} key={optionLabel} testID="TopFilter-View-ButtonTiny-container">
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

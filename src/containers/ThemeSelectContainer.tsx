import React, { useEffect, useState } from 'react';
import { SectionListData } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { connect } from 'react-redux';

import { RootState } from '../reducers';
import { setUserSelectedTheme, UserTheme } from '../reducers/user';
import { selectUserAvailableThemes, selectUserSelectedTheme } from '../selectors/user';

import { CustomSectionList, IListItem } from '../components/CustomSectionList';
import colors from '../constants/colors';

type Props = NavigationInjectedProps & StateProps & DispatchProps;

export const ThemeSelectContainerComponent: React.FC<Props> = React.memo((props) => {
  const [isLoadingTheme, setIsLoadingTheme] = useState('');

  useEffect(() => {
    setIsLoadingTheme('')
  }, [props.userSelectedTheme])

  const sectionListData: ReadonlyArray<SectionListData<IListItem>> = [
    {
      key: 'user-theme',
      title: 'Theme',
      data: props.userAvailableThemes.map(theme => {
        const isSelected = theme === props.userSelectedTheme;
        const capitalizedTitle = theme[0].toUpperCase() + theme.slice(1);
        const subtitle = (theme === UserTheme.auto) ? 'Uses your phone settings to determine which theme to use.' : (theme === UserTheme.light) ? 'Perfect for during the day.' : 'For low light situations, like at night.'

        return {
          key: theme,
          title: capitalizedTitle,
          subtitle,
          chevron: false,
          checkmark: true,
          isSelected,
          isLoading: (isLoadingTheme === theme),
          icon: (theme === UserTheme.light) ? 'sun' : (theme === UserTheme.dark) ? 'moon' : 'clock',
          iconColor: colors.green,
          onPress: () => {
            // Only change when it's a different theme
            // So we do not show the loading indicator when the user presses the same theme twice
            if (!isSelected) {
              setIsLoadingTheme(theme)
              requestAnimationFrame(() => {
                props.setUserSelectedTheme(theme)
              })
            }
          }
        }
      })
    }
  ];

  return <CustomSectionList sectionListData={sectionListData} />;
})

interface DispatchProps {
  readonly setUserSelectedTheme: typeof setUserSelectedTheme;
}

interface StateProps {
  readonly userSelectedTheme: ReturnType<typeof selectUserSelectedTheme>;
  readonly userAvailableThemes: ReturnType<typeof selectUserAvailableThemes>;
}

const mapStateToProps = (state: RootState) => ({
  userSelectedTheme: selectUserSelectedTheme(state),
  userAvailableThemes: selectUserAvailableThemes(state),
});

const mapDispatchToProps = {
  setUserSelectedTheme
};

export const ThemeSelectContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ThemeSelectContainerComponent)

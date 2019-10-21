import React from 'react';
import { SectionListData, LayoutAnimation } from 'react-native';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

import { RootState } from '../reducers';
import { setUserSelectedTheme, UserTheme } from '../reducers/user';
import { selectUserAvailableThemes, selectUserSelectedTheme } from '../selectors/user';

import { CustomSectionList, IListItem } from '../components/CustomSectionList';
import colors from '../constants/colors';


type Props = NavigationInjectedProps & StateProps & DispatchProps;

export class ThemeSelectContainerComponent extends React.Component<Props> {
  render() {
    const sectionListData: ReadonlyArray<SectionListData<IListItem>> = [
      {
        key: 'user-theme',
        title: 'Theme',
        data: this.props.userAvailableThemes.map(theme => {
          const isSelected = theme === this.props.userSelectedTheme;
          const capitalizedTitle = theme[0].toUpperCase() + theme.slice(1);
          const subtitle = (theme === UserTheme.auto) ? 'Uses your phone settings to determine which theme to use.' : (theme === UserTheme.light) ? 'Perfect for during the day.' : 'For low light situations, like at night.'

          return {
            key: theme,
            title: capitalizedTitle,
            subtitle,
            chevron: false,
            checkmark: true,
            isSelected,
            icon: (theme === UserTheme.light) ? 'sun' : (theme === UserTheme.dark) ? 'moon' : 'clock',
            iconColor: colors.green,
            onPress: () => this.props.setUserSelectedTheme(theme)
          }
        })
      }
    ];

    return <CustomSectionList sectionListData={sectionListData} />;
  }
}

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

export const ThemeSelectContainer = withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ThemeSelectContainerComponent)
);

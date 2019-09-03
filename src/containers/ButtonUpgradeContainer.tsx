import React from 'react';
import { connect } from 'react-redux';

import { NavigationInjectedProps } from 'react-navigation';
import { ButtonUpgrade } from '../components/ButtonUpgrade';
import NavigationService from '../navigation/NavigationService';
import { RootState } from '../reducers';
import { selectUserIsSubscribed } from '../selectors/user';

type Props = StateProps & NavigationInjectedProps;

export class ButtonUpgradeContainerComponent extends React.PureComponent<Props> {
  handleOnPressUpgrade = () => {
    requestAnimationFrame(() => NavigationService.navigate('Upgrade'))
  }

  render() {
    const { isSubscribed } = this.props;

    if (isSubscribed) { return null; }

    return (
      <ButtonUpgrade onPress={this.handleOnPressUpgrade} />
    );
  }
}

interface StateProps {
  isSubscribed: ReturnType<typeof selectUserIsSubscribed>;
}

const mapStateToProps = (state: RootState, props: Props): StateProps => ({
  isSubscribed: selectUserIsSubscribed(state),
});

export const ButtonUpgradeContainer =
  connect(
    mapStateToProps
  )(ButtonUpgradeContainerComponent)

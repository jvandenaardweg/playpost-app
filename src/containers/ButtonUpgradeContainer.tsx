import React from 'react';
import { connect } from 'react-redux';

import { RootState } from '../reducers';
import { selectIsSubscribed } from '../selectors/subscriptions';
import { ButtonUpgrade } from '../components/ButtonUpgrade';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';

type Props = StateProps & NavigationInjectedProps;

export class ButtonUpgradeContainerComponent extends React.PureComponent<Props> {
  render() {
    const { isSubscribed } = this.props;

    if (isSubscribed) return null;

    return (
      <ButtonUpgrade onPress={() => this.props.navigation.navigate('Upgrade')} />
    );
  }
}

interface StateProps {
  isSubscribed: ReturnType<typeof selectIsSubscribed>;
}

const mapStateToProps = (state: RootState, props: Props): StateProps => ({
  isSubscribed: selectIsSubscribed(state),
});

const mapDispatchToProps = {};

export const ButtonUpgradeContainer =
  withNavigation(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(ButtonUpgradeContainerComponent)
  );

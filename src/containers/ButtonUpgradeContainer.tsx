import React from 'react';
import { connect } from 'react-redux';

import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { ButtonUpgrade } from '../components/ButtonUpgrade';
import { RootState } from '../reducers';
import { selectIsSubscribed } from '../selectors/subscriptions';

type Props = StateProps & NavigationInjectedProps;

export class ButtonUpgradeContainerComponent extends React.PureComponent<Props> {
  public render(): JSX.Element | null {
    const { isSubscribed } = this.props;

    if (isSubscribed) { return null; }

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

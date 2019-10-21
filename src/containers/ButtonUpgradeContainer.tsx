// import analytics from '@react-native-firebase/analytics';
import React from 'react';
import { connect } from 'react-redux';

import { NavigationInjectedProps } from 'react-navigation';
import { ButtonUpgrade } from '../components/ButtonUpgrade';
import NavigationService from '../navigation/NavigationService';
import { RootState } from '../reducers';
import { selectUserIsSubscribed } from '../selectors/user';

type Props = StateProps & NavigationInjectedProps;

export const ButtonUpgradeContainerComponent: React.FC<Props> = React.memo((props) => {
  const handleOnPressUpgrade = () => {
    requestAnimationFrame(async () => {
      NavigationService.navigate('Upgrade')
    })
  }

  if (props.isSubscribed) { return null; }

  return (
    <ButtonUpgrade onPress={handleOnPressUpgrade} />
  );
})

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

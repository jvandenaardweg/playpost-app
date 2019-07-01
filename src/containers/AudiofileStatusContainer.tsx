import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

import { selectPlayerAudiofileStatus } from '../selectors/player';

import { RootState } from '../reducers';
import fonts from '../constants/fonts';

type Props = StateProps & DispatchProps;

class AudiofileStatusComponent extends React.PureComponent<Props> {
  render() {
    const { audiofileStatus } = this.props;

    if (!audiofileStatus) return null;

    return (
      <View
        style={{
          // backgroundColor: 'red',
          position: 'absolute',
          top: -54,
          height: 50,
          width: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            width: 260,
            backgroundColor: 'rgba(0, 0, 0, 1)',
            borderRadius: 100,
            // flex: 1,
            height: 38,
            alignItems: 'center',
            justifyContent: 'center',
            // flex: 1,
            flexDirection: 'row'
          }}
        >
          <ActivityIndicator size="small" color="white" />
          <Text
            style={{
              color: 'white',
              fontSize: fonts.fontSize.body,
              marginLeft: 8,
              fontWeight: fonts.fontWeight.medium
            }}
          >
            {audiofileStatus}
          </Text>
        </View>
      </View>
    );
  }
}

interface StateProps {
  audiofileStatus: ReturnType<typeof selectPlayerAudiofileStatus>;
}

interface DispatchProps {}

const mapStateToProps = (state: RootState): StateProps => ({
  audiofileStatus: selectPlayerAudiofileStatus(state)
});

const mapDispatchToProps: DispatchProps = {};

export const AudiofileStatusContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AudiofileStatusComponent);

import { createStore } from 'redux';

import { selectDeviceLocale,
  selectUserActiveSubscriptionName,
  selectUserActiveSubscriptionProductId,
  selectUserDetails,
  selectUserError,
  selectUserErrorSaveSelectedVoice,
  selectUserHasUsedFreeIntroduction,
  selectUserIsEligibleForTrial,
  selectUserIsLoading,
  selectUserIsSubscribed,
  selectUserPlaybackSpeed,
  selectUserSelectedVoiceByLanguageName,
  selectUserSelectedVoices,
  selectUserUsedInAppSubscriptionTrials,
  userSelector
} from '../user';

import { rootReducer } from '../../reducers';
import { initialState } from '../../reducers/user';

import exampleApplePurchases from '../../../tests/__mocks__/apple-purchases';
import exampleUserWithActiveSubscription from '../../../tests/__mocks__/user-active-subscription';
import mockUserAllTrialsUsed from '../../../tests/__mocks__/user-all-trials-used';
import exampleUserWithInactiveSubscription from '../../../tests/__mocks__/user-inactive-subscription';

import { SUBSCRIPTION_PRODUCT_ID_FREE, SUBSCRIPTION_PRODUCT_ID_PREMIUM_APPLE } from '../../constants/in-app-purchase';

const store = createStore(rootReducer);

const rootState = store.getState();
// const userStore = rootState.user;

describe('user selector', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should return the initial state', () => {
    expect(userSelector(rootState)).toEqual(initialState);
  });

  it('should return the user error', () => {
    const exampleErrorState = {
      ...rootState,
      user: {
        ...rootState.user,
        error: 'Test error'
      }
    };

    expect(selectUserError(exampleErrorState)).toBe('Test error');
  });

  it('selectUserErrorSaveSelectedVoice should return the user error', () => {
    const exampleErrorState = {
      ...rootState,
      user: {
        ...rootState.user,
        errorSaveSelectedVoice: 'Test error 2'
      }
    };

    expect(selectUserErrorSaveSelectedVoice(exampleErrorState)).toBe('Test error 2');
  });

  it('should return the loading status', () => {
    const exampleLoadingState = {
      ...rootState,
      user: {
        ...rootState.user,
        isLoading: true
      }
    };

    expect(selectUserIsLoading(exampleLoadingState)).toBe(true);
  });

  it('should return the user details', () => {

    const exampleUserDetailsState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: exampleUserWithActiveSubscription
      }
    };

    expect(selectUserDetails(exampleUserDetailsState)).toMatchObject(exampleUserWithActiveSubscription);
  });

  it('should return the user\'s selected voices', () => {
    const exampleUserDetailsState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: exampleUserWithActiveSubscription
      }
    };

    const expected = exampleUserWithActiveSubscription.voiceSettings.map(userVoiceSetting => userVoiceSetting.voice);

    expect(selectUserSelectedVoices(exampleUserDetailsState)).toEqual(expected);

    const exampleUserDetailsState2 = {
      ...rootState,
      user: {
        ...initialState
      }
    };
    expect(selectUserSelectedVoices(exampleUserDetailsState2)).toEqual([]);
  });

  it('should return the user\'s selected voices by language name', () => {
    const exampleUserDetailsState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: exampleUserWithActiveSubscription
      }
    };

    expect(selectUserSelectedVoiceByLanguageName(exampleUserDetailsState)).toMatchSnapshot();
  });

  it('selectDeviceLocale should return the user\'s subscriptions', () => {
    const exampleUserStateOne = {
      ...rootState,
      user: {
        ...rootState.user,
        deviceLocale: 'en-NL'
      }
    };

    const exampleUserStateTwo = {
      ...rootState,
      user: {
        ...rootState.user,
        deviceLocale: 'en'
      }
    };

    const exampleUserStateThree = {
      ...rootState,
      user: {
        ...rootState.user,
        deviceLocale: ''
      }
    };

    expect(selectDeviceLocale(exampleUserStateOne)).toEqual('en');
    expect(selectDeviceLocale(exampleUserStateTwo)).toEqual('en');
    expect(selectDeviceLocale(exampleUserStateThree)).toEqual('');
  });

  it('selectUserPlaybackSpeed should return a number', () => {
    const exampleUserState = {
      ...rootState,
      user: {
        ...rootState.user,
        playbackSpeed: 0.95
      }
    };

    expect(selectUserPlaybackSpeed(exampleUserState)).toEqual(0.95);
  });

  it('selectUserIsSubscribed should return false when there is no user details', () => {
    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user
      }
    };

    expect(selectUserIsSubscribed(exampleState)).toEqual(false);
  });

  it('selectUserHasUsedFreeIntroduction should return true when it is true inside user details', () => {
    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: {
          ...exampleUserWithActiveSubscription,
          hasUsedFreeIntroduction: true
        }
      }
    };

    expect(selectUserHasUsedFreeIntroduction(exampleState)).toEqual(true);
  });

  it('selectUserHasUsedFreeIntroduction should return false when it is false inside user details', () => {
    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: {
          ...exampleUserWithActiveSubscription,
          hasUsedFreeIntroduction: false
        }
      }
    };

    expect(selectUserHasUsedFreeIntroduction(exampleState)).toEqual(false);
  });

  it('selectUserIsSubscribed should return true when there is an active subscription', () => {
    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: exampleUserWithActiveSubscription
      }
    };

    expect(selectUserIsSubscribed(exampleState)).toEqual(true);
  });

  it('selectUserIsSubscribed should return false when there is no active subscription', () => {
    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: exampleUserWithInactiveSubscription
      }
    };

    expect(selectUserIsSubscribed(exampleState)).toEqual(false);
  });

  it('selectUserActiveSubscriptionProductId should return the default productId "free" when there are no active subscriptions', () => {
    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: exampleUserWithInactiveSubscription
      }
    };

    // The mock data contains a unsubscribed/expired subscription
    expect(selectUserActiveSubscriptionProductId(exampleState)).toEqual(SUBSCRIPTION_PRODUCT_ID_FREE);
  });

  it('selectUserActiveSubscriptionProductId should return the active subscription productId', () => {
    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: exampleUserWithActiveSubscription
      }
    };

    // The mock data contains a unsubscribed/expired subscription
    expect(selectUserActiveSubscriptionProductId(exampleState)).toEqual(SUBSCRIPTION_PRODUCT_ID_PREMIUM_APPLE);
  });

  it('selectUserActiveSubscriptionProductId should return the default productId "free" when the user has no active subscription', () => {
    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: exampleUserWithInactiveSubscription
      }
    };

    // The mock data contains a unsubscribed/expired subscription
    expect(selectUserActiveSubscriptionProductId(exampleState)).toEqual(SUBSCRIPTION_PRODUCT_ID_FREE);
  });

  it('selectUserActiveSubscriptionProductId should return the default productId "free" when there is no user info', () => {
    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: null
      }
    };

    // The mock data contains a unsubscribed/expired subscription
    expect(selectUserActiveSubscriptionProductId(exampleState)).toEqual(SUBSCRIPTION_PRODUCT_ID_FREE);
  });

  it('selectUserActiveSubscriptionName should return the active subscription name when the user has a validated subscription', () => {
    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: exampleUserWithActiveSubscription
      }
    };

    // The mock data contains a unsubscribed/expired subscription
    expect(selectUserActiveSubscriptionName(exampleState)).toEqual('Premium');
  });

  it('selectUserActiveSubscriptionName should return "Free" if the user has no subscription', () => {
    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: null
      }
    };

    // The mock data contains a unsubscribed/expired subscription
    expect(selectUserActiveSubscriptionName(exampleState)).toEqual('Free');
  });

  it('selectUserUsedInAppSubscriptionTrials should return the in app subscriptions the user had a trial from', () => {
    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: mockUserAllTrialsUsed
      },
      subscriptions: {
        ...rootState.subscriptions,
        localPurchaseHistory: []
      }
    };

    expect(selectUserUsedInAppSubscriptionTrials(exampleState)).toEqual(mockUserAllTrialsUsed.usedInAppSubscriptionTrials);
  });

  it('selectUserIsEligibleForTrial should return false if the user has already used a trial on Apple and Google when on iOS', () => {
    const Platform = require('react-native').Platform;
    Platform.OS = 'ios';

    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: mockUserAllTrialsUsed
      },
      subscriptions: {
        ...rootState.subscriptions,
        localPurchaseHistory: []
      }
    };

    // The mock data contains a unsubscribed/expired subscription
    expect(selectUserIsEligibleForTrial(exampleState)).toEqual(false);
  });

  it('selectUserIsEligibleForTrial should return false if the user has already used a trial on Apple and Google when on Android', () => {
    const Platform = require('react-native').Platform;
    Platform.OS = 'android';

    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: mockUserAllTrialsUsed
      },
      subscriptions: {
        ...rootState.subscriptions,
        localPurchaseHistory: []
      }
    };

    // The mock data contains a unsubscribed/expired subscription
    expect(selectUserIsEligibleForTrial(exampleState)).toEqual(false);
  });

  it('selectUserIsEligibleForTrial should return true if the user is on Android but only used a trial on Apple', () => {
    const Platform = require('react-native').Platform;
    Platform.OS = 'android';

    const mockUserUsedTrialApple = {
      ...mockUserAllTrialsUsed,
      usedInAppSubscriptionTrials: mockUserAllTrialsUsed.usedInAppSubscriptionTrials.filter((usedInAppSubscriptionTrial) => usedInAppSubscriptionTrial.service === 'apple')
    }

    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: mockUserUsedTrialApple
      },
      subscriptions: {
        ...rootState.subscriptions,
        localPurchaseHistory: []
      }
    };

    // The mock data contains a unsubscribed/expired subscription
    expect(selectUserIsEligibleForTrial(exampleState)).toEqual(true);
  });

  it('selectUserIsEligibleForTrial should return true if the user is on iOS but only used a trial on Google', () => {
    const Platform = require('react-native').Platform;
    Platform.OS = 'ios';

    const mockUserUsedTrialGoogle = {
      ...mockUserAllTrialsUsed,
      usedInAppSubscriptionTrials: mockUserAllTrialsUsed.usedInAppSubscriptionTrials.filter((usedInAppSubscriptionTrial) => usedInAppSubscriptionTrial.service === 'google')
    }

    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: mockUserUsedTrialGoogle
      },
      subscriptions: {
        ...rootState.subscriptions,
        localPurchaseHistory: []
      }
    };

    // The mock data contains a unsubscribed/expired subscription
    expect(selectUserIsEligibleForTrial(exampleState)).toEqual(true);
  });

  it('selectUserIsEligibleForTrial should return false if the user is on iOS but only used a trial on Apple', () => {
    const Platform = require('react-native').Platform;
    Platform.OS = 'ios';

    const mockUserUsedTrialApple = {
      ...mockUserAllTrialsUsed,
      usedInAppSubscriptionTrials: mockUserAllTrialsUsed.usedInAppSubscriptionTrials.filter((usedInAppSubscriptionTrial) => usedInAppSubscriptionTrial.service === 'apple')
    }

    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: mockUserUsedTrialApple
      },
      subscriptions: {
        ...rootState.subscriptions,
        localPurchaseHistory: []
      }
    };

    expect(selectUserIsEligibleForTrial(exampleState)).toEqual(false);
  });

  it('selectUserIsEligibleForTrial should return false if the user is on Android but only used a trial on Google', () => {
    const Platform = require('react-native').Platform;
    Platform.OS = 'android';

    const mockUserUsedTrialGoogle = {
      ...mockUserAllTrialsUsed,
      usedInAppSubscriptionTrials: mockUserAllTrialsUsed.usedInAppSubscriptionTrials.filter((usedInAppSubscriptionTrial) => usedInAppSubscriptionTrial.service === 'google')
    }

    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: mockUserUsedTrialGoogle
      },
      subscriptions: {
        ...rootState.subscriptions,
        localPurchaseHistory: []
      }
    };

    expect(selectUserIsEligibleForTrial(exampleState)).toEqual(false);
  });

  it('selectUserIsEligibleForTrial should return true if the user never used a trial before', () => {
    const mockUserNoTrials = {
      ...mockUserAllTrialsUsed,
      usedInAppSubscriptionTrials: []
    }

    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: mockUserNoTrials
      },
      subscriptions: {
        ...rootState.subscriptions,
        localPurchaseHistory: []
      }
    };

    expect(selectUserIsEligibleForTrial(exampleState)).toEqual(true);
  });

  it('selectUserIsEligibleForTrial should return false if there is a local purchase history', () => {
    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: null
      },
      subscriptions: {
        ...rootState.subscriptions,
        localPurchaseHistory: exampleApplePurchases
      }
    };

    expect(selectUserIsEligibleForTrial(exampleState)).toEqual(false);
  });

  it('selectUserIsEligibleForTrial should return true if there is no local purchase history', () => {
    const exampleState = {
      ...rootState,
      user: {
        ...rootState.user,
        details: null
      },
      subscriptions: {
        ...rootState.subscriptions,
        localPurchaseHistory: []
      }
    };

    expect(selectUserIsEligibleForTrial(exampleState)).toEqual(true);
  });

});

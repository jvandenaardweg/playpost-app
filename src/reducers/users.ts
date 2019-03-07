import Analytics from 'appcenter-analytics';

export const CREATE_USER = 'users/CREATE_USER';
export const CREATE_USER_SUCCESS = 'users/CREATE_USER_SUCCESS';
export const CREATE_USER_FAIL = 'users/CREATE_USER_FAIL';

export interface UsersState {
  isLoading: boolean
  user: Api.User | null
  error: string | null
}

const initialState: UsersState = {
  isLoading: false,
  user: null,
  error: null
}

export function usersReducer(state = initialState, action: any) {
  switch (action.type) {
    case CREATE_USER:
      return {
        ...state,
        isLoading: true
      };
    case CREATE_USER_SUCCESS:
      Analytics.trackEvent('Create user success');

      return {
        ...state,
        isLoading: false,
        user: action.payload.data,
        error: null
      };
    case CREATE_USER_FAIL:
      const genericMessage = 'An unknown error happened while creating your account. Please contact us when this happens all the time.';

      if (action.error.response && action.error.response.data && action.error.response.data.message) {
        Analytics.trackEvent('Error create user', { message: action.error.response.data.message });
      } else {
        Analytics.trackEvent('Error create user', { message: genericMessage });
      }

      return {
        ...state,
        isLoading: false,
        user: null,
        error: (action.error.response) ? action.error.response.data.message : genericMessage
      };
    default:
      return state;
  }
}

export function createUser(email: string, password: string) {
  return {
    type: CREATE_USER,
    payload: {
      request: {
        method: 'post',
        url: '/v1/users',
        data: {
          email,
          password
        }
      }
    }
  };
}

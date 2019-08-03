import { NavigationActions, NavigationBackActionPayload, NavigationSetParamsActionPayload } from 'react-navigation';

/* tslint:disable no-any */

let navigator: any;

function setTopLevelNavigator(navigatorRef: any) {
  navigator = navigatorRef;
}

function navigate(routeName: string, params?: object) {
  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function goBack(payload: NavigationBackActionPayload) {
  navigator.dispatch(
    NavigationActions.back({
      ...payload
    })
  );
}

function setParams(payload: NavigationSetParamsActionPayload) {
  navigator.dispatch(
    NavigationActions.setParams({
      ...payload
    })
  );
}


// add other navigation functions that you need and export them

export default {
  navigate,
  setParams,
  goBack,
  setTopLevelNavigator,
};

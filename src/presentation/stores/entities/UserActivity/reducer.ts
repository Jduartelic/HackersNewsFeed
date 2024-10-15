import {
  UserActivityKind,
  StateStoreUserActivityData,
  UserActivityActions,
} from '../../entities';
import {setSavedData} from '../../../functions';
import {constants} from '../../../constants';

export function UserActivityDataReducer(
  state: StateStoreUserActivityData,
  action: UserActivityActions,
) {
  const {type, error} = action;
  let dataPayload: string = '';

  switch (type) {
    case UserActivityKind.INITIAL_STATE:
      return {
        ...state,
        state: {...state.state},
        loading: false,
        fetched: false,
        error: error,
      };
    case UserActivityKind.FETCHING:
      return {
        ...state,
        state: {
          ...state.state,
          facets: action.payload.facets,
          facetsSelectedByUser: action.payload.facetsSelectedByUser,
          querySearch: action.payload.querySearch,
          hasSeenOnboarding: action.payload.hasSeenOnboarding,
          userName: action.payload.userName,
        },
        loading: true,
        fetched: false,
        error: error,
      };
    case UserActivityKind.FETCHED:
      dataPayload = JSON.stringify({
        ...action.payload,
        hasSeenOnboarding: true,
        appStateActivity: 'active',
      });

      setSavedData(constants.USER_ACTIVITY.STORAGE_KEY, dataPayload);

      return {
        ...state,
        state: {
          facets: action.payload.facets,
          facetsSelectedByUser: action.payload.facetsSelectedByUser,
          querySearch: action.payload.querySearch,
          hasSeenOnboarding: action.payload.hasSeenOnboarding,
          userName: action.payload.userName,
          pushNotifications: {
            appStateActivity: action.payload.pushNotifications.appStateActivity,
            sentPushNotification:
              action.payload.pushNotifications.sentPushNotification,
            timeForNextPush: action.payload.pushNotifications.timeForNextPush,
          },
        },
        loading: false,
        fetched: true,
        error: error,
      };

    case UserActivityKind.PUSH_NOTIFICATION_PROCESS: {
      return {
        ...state,
        state: {
          ...state.state,
          facets: action.payload.facets,
          facetsSelectedByUser: action.payload.facetsSelectedByUser,
          querySearch: action.payload.querySearch,
          hasSeenOnboarding: action.payload.hasSeenOnboarding,
          userName: action.payload.userName,
          pushNotifications: {
            appStateActivity: action.payload.pushNotifications.appStateActivity,
            sentPushNotification:
              action.payload.pushNotifications.sentPushNotification,
            timeForNextPush: action.payload.pushNotifications.timeForNextPush,
          },
        },
        loading: false,
        fetched: true,
        error: error,
      };
    }
    case UserActivityKind.DEFAULT:
      return {
        ...state,
      };
  }
}

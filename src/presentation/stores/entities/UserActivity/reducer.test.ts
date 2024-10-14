import {
  UserActivityKind,
  StateStoreUserActivityData,
  defaultUserActivityContextValues,
} from '../../entities';
import {UserActivityDataReducer} from './reducer';
import {constants} from '../../../constants';

const mockStateStoreUserActivityData: StateStoreUserActivityData =
  defaultUserActivityContextValues.stateUserActivityData;
const mockConstants = constants.USER_ACTIVITY;
const mockQueryParam = mockConstants.FACETS.keywords.technology[5];

describe('UserActivity reducer', () => {
  it('should call INITIAL_STATE type in UserActivity reducer', () => {
    const result = UserActivityDataReducer(
      {
        ...mockStateStoreUserActivityData,
      },
      {
        type: UserActivityKind.INITIAL_STATE,
        payload: {
          ...mockStateStoreUserActivityData.state,
        },
        loading: false,
        fetched: false,
        error: undefined,
      },
    );

    expect(result.state).toStrictEqual(mockStateStoreUserActivityData.state);
  });

  it('should call PUSH_NOTIFICATION_PROCESS type in UserActivity reducer', () => {
    const result = UserActivityDataReducer(
      {
        ...mockStateStoreUserActivityData,
      },
      {
        type: UserActivityKind.PUSH_NOTIFICATION_PROCESS,
        payload: {
          ...mockStateStoreUserActivityData.state,
          querySearch: mockConstants.FACETS.keywords.technology[5],
          pushNotifications: {
            appStateActivity: 'background',
            sentPushNotification: true,
            timeForNextPush: 1000,
          },
        },
        loading: false,
        fetched: false,
        error: undefined,
      },
    );

    expect(result.state.pushNotifications).toBeTruthy();
  });

  it('should call FETCHING type in UserActivity reducer', () => {
    const result = UserActivityDataReducer(
      {
        ...mockStateStoreUserActivityData,
      },
      {
        type: UserActivityKind.FETCHING,
        payload: {
          ...mockStateStoreUserActivityData.state,
        },
        loading: true,
        fetched: false,
        error: undefined,
      },
    );

    expect(result.loading).toBeTruthy();
    expect(result.fetched).toBeFalsy();
  });

  it('should call FETCHED type in UserActivity reducer', () => {
    const result = UserActivityDataReducer(
      {
        ...mockStateStoreUserActivityData,
      },
      {
        type: UserActivityKind.FETCHED,
        payload: {
          facets: mockConstants.FACETS.keywords.technology,
          facetsSelectedByUser: mockConstants.FACETS.keywords.technology,
          querySearch: mockQueryParam,
          hasSeenOnboarding: true,
          userName: '',
          pushNotifications: {
            appStateActivity: 'active',
            sentPushNotification: true,
            timeForNextPush: 1000,
          },
        },
        loading: false,
        fetched: true,
        error: undefined,
      },
    );

    expect(result.fetched).toBeTruthy();
    expect(result.loading).toBeFalsy();
  });

  it('should call DEFAULT type in UserActivity reducer', async () => {
    const result = UserActivityDataReducer(
      {
        ...mockStateStoreUserActivityData,
      },
      {
        type: UserActivityKind.DEFAULT,
        payload: {...mockStateStoreUserActivityData.state},
        loading: false,
        fetched: false,
        error: undefined,
      },
    );

    expect(result).toEqual(mockStateStoreUserActivityData);
  });
});

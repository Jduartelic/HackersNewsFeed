import React from 'react';

export enum UserActivityKind {
  FETCHED = 'FETCHED',
  FETCHING = 'FETCHING',
  INITIAL_STATE = 'INITIAL_STATE',
  DEFAULT = 'DEFAULT',
  PUSH_NOTIFICATION_PROCESS = 'PUSH_NOTIFICATION_PROCESS',
  SAVE_INPUT = 'SAVE_INPUT',
}

export type UserActivityEntity = {
  facets?: string[];
  facetsSelectedByUser?: string[];
  querySearch?: string;
  hasSeenOnboarding?: boolean;
  userName: string;
  pushNotifications: PushNotificationActivityEntity;
};

export type PushNotificationActivityEntity = {
  appStateActivity: string;
  sentPushNotification: boolean;
  timeForNextPush: number;
};

export type UserActivityPayloadEntity = {
  facets?: string[];
  facetsSelectedByUser?: string[];
  querySearch?: string;
  hasSeenOnboarding?: boolean;
  userName: string;
  pushNotifications: PushNotificationActivityEntity;
};

export interface UserActivityActions {
  type: UserActivityKind;
  payload: UserActivityPayloadEntity;
  loading?: boolean;
  fetched?: boolean;
  error?: Error;
}

export interface StateStoreUserActivityData {
  state: UserActivityEntity;
  loading: boolean;
  fetched: boolean;
  error?: Error;
}

export type UserActivityContextType = {
  stateUserActivityData: StateStoreUserActivityData;
  dispatchUserActivityData: React.Dispatch<UserActivityActions>;
};

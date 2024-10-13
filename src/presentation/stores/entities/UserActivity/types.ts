import React from 'react';

export enum UserActivityKind {
  FETCHED = 'FETCHED',
  FETCHING = 'FETCHING',
  INITIAL_STATE = 'INITIAL_STATE',
  DEFAULT = 'DEFAULT',
}

export type UserActivityEntity = {
  facets?: string[];
  facetsSelectedByUser?: string[];
  querySearch?: string[];
  hasSeenOnboarding?: boolean;
  userName: string;
};

export type UserActivityPayloadEntity = {
  facets?: string[];
  facetsSelectedByUser?: string[];
  querySearch?: string[];
  hasSeenOnboarding?: boolean;
  userName: string;
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

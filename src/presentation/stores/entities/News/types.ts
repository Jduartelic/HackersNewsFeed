import React from 'react';
import {News} from '../../../../domain';

export enum NewsKind {
  FETCHED = 'FETCHED',
  FETCHING = 'FETCHING',
  INITIAL_STATE = 'INITIAL_STATE',
  DEFAULT = 'DEFAULT',
}

type NewsEntity = {
  newsList: News;
};

export interface NewsActions {
  type: NewsKind;
  payload: NewsEntity;
  loading?: boolean;
  fetched?: boolean;
  error?: Error;
}

export interface StateStoreNewsData {
  state: NewsEntity;
  loading: boolean;
  fetched: boolean;
  error?: Error;
}

export type NewsContextType = {
  stateNewsData: StateStoreNewsData;
  dispatchNewsData: React.Dispatch<NewsActions>;
};

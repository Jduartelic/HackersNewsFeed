import React from 'react';
import {News} from '../../../../domain';

export enum NewsKind {
  FETCHED = 'FETCHED',
  FETCHING = 'FETCHING',
  INITIAL_STATE = 'INITIAL_STATE',
  DEFAULT = 'DEFAULT',
  REMOVE_NEWS = 'REMOVE_NEWS',
  ADD_FAVORITES = 'ADD_FAVORITES',
}

type NewsEntity = {
  newsList: News;
  favoritesNewsList: number[];
  deletedNewsList: number[];
};

type NewsPayloadEntity = {
  newsList: News;
  favoritesNewsId?: number;
  deletedNewsId?: number;
};

export interface NewsActions {
  type: NewsKind;
  payload: NewsPayloadEntity;
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

import React, {ReactNode, useMemo, useReducer} from 'react';
import {NewsDataReducer, NewsContextType} from '../../entities';

export const defaultNewsContextValues: NewsContextType = {
  stateNewsData: {
    state: {
      newsList: {data: []},
      favoritesNewsList: [],
      deletedNewsList: [],
    },
    loading: false,
    fetched: false,
  },
  dispatchNewsData: data => {
    return NewsDataReducer(
      {
        state: {
          newsList: {data: []},
          favoritesNewsList: [],
          deletedNewsList: [],
        },
        loading: data?.loading ?? false,
        fetched: data?.fetched ?? false,
        error: data?.error,
      },
      {
        type: data?.type,
        payload: data?.payload,
        loading: data?.loading,
        fetched: data?.fetched,
        error: data?.error,
      },
    );
  },
};

export const NewsContext = React.createContext<NewsContextType>(
  defaultNewsContextValues,
);

export const NewsContextProvider = ({children}: {children: ReactNode}) => {
  const [stateNewsData, dispatchNewsData] = useReducer(NewsDataReducer, {
    state: {
      newsList: {data: []},
      favoritesNewsList: [],
      deletedNewsList: [],
    },
    loading: false,
    fetched: false,
  });

  const value: NewsContextType = useMemo(
    () => ({stateNewsData, dispatchNewsData}),
    [stateNewsData, dispatchNewsData],
  );

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
};

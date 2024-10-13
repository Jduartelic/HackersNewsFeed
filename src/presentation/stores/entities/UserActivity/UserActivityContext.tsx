import React, {ReactNode, useMemo, useReducer} from 'react';
import {UserActivityDataReducer, UserActivityContextType} from '../../entities';

export const defaultUserActivityContextValues: UserActivityContextType = {
  stateUserActivityData: {
    state: {
      facets: [],
      facetsSelectedByUser: [],
      querySearch: [],
      hasSeenOnboarding: true,
      userName: '',
    },
    loading: false,
    fetched: false,
  },
  dispatchUserActivityData: data => {
    return UserActivityDataReducer(
      {
        state: {
          facets: [],
          facetsSelectedByUser: [],
          querySearch: [],
          userName: '',
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

export const UserActivityContext = React.createContext<UserActivityContextType>(
  defaultUserActivityContextValues,
);

export const UserActivityContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  //  await localStorageActivityUser();

  const [stateUserActivityData, dispatchUserActivityData] = useReducer(
    UserActivityDataReducer,
    {
      state: {
        facets: [],
        facetsSelectedByUser: [],
        querySearch: [],
        hasSeenOnboarding: true,
        userName: '',
      },
      loading: false,
      fetched: false,
    },
  );

  const value: UserActivityContextType = useMemo(
    () => ({stateUserActivityData, dispatchUserActivityData}),
    [stateUserActivityData, dispatchUserActivityData],
  );

  return (
    <UserActivityContext.Provider value={value}>
      {children}
    </UserActivityContext.Provider>
  );
};

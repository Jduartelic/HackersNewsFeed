import {
  NewsActions,
  NewsContextType,
  NewsKind,
  StateStoreNewsData,
  NewsPayloadEntity,
} from './News/types';
import {NewsDataReducer} from './News/reducer';
import {
  NewsContext,
  NewsContextProvider,
  defaultNewsContextValues,
} from './News/NewsContext';

import {
  StateStoreUserActivityData,
  UserActivityActions,
  UserActivityContextType,
  UserActivityKind,
  UserActivityPayloadEntity,
  UserActivityEntity,
} from './UserActivity/types';
import {UserActivityDataReducer} from './UserActivity/reducer';
import {
  UserActivityContext,
  UserActivityContextProvider,
  defaultUserActivityContextValues,
} from './UserActivity/UserActivityContext';

export {
  type NewsActions,
  type NewsContextType,
  type NewsPayloadEntity,
  type StateStoreNewsData,
  type StateStoreUserActivityData,
  type UserActivityActions,
  type UserActivityContextType,
  type UserActivityPayloadEntity,
  type UserActivityEntity,
  UserActivityKind,
  NewsKind,
  NewsContext,
  NewsContextProvider,
  defaultNewsContextValues,
  NewsDataReducer,
  UserActivityDataReducer,
  UserActivityContext,
  UserActivityContextProvider,
  defaultUserActivityContextValues,
};

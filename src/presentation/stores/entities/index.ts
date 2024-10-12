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

export {
  type NewsActions,
  type NewsContextType,
  type NewsPayloadEntity,
  type StateStoreNewsData,
  NewsKind,
  NewsContext,
  NewsContextProvider,
  defaultNewsContextValues,
  NewsDataReducer,
};

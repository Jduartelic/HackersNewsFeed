import {NewsKind, NewsActions, StateStoreNewsData} from '../../entities';
import {News} from '../../../../domain';

export function NewsDataReducer(
  state: StateStoreNewsData,
  action: NewsActions,
) {
  const {type, error} = action;

  switch (type) {
    case NewsKind.INITIAL_STATE:
      return {
        ...state,
        state: {
          newsList: {data: []},
        },
        loading: false,
        fetched: false,
        error: error,
      };
    case NewsKind.FETCHING:
      return {
        ...state,
        state: {
          newsList: {data: []},
        },
        loading: true,
        fetched: false,
        error: error,
      };
    case NewsKind.FETCHED:
      return {
        ...state,
        state: {
          newsList: action.payload.newsList,
        },
        loading: false,
        fetched: true,
        error: error,
      };
    case NewsKind.DEFAULT:
      return {
        ...state,
      };
  }
}

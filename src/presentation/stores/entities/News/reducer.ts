import {NewsKind, NewsActions, StateStoreNewsData} from '../../entities';
import {setSavedData} from '../../../functions';
import {constants} from '../../../constants';

export function NewsDataReducer(
  state: StateStoreNewsData,
  action: NewsActions,
) {
  const {type, error} = action;
  let dataPayload: string = '';

  switch (type) {
    case NewsKind.INITIAL_STATE:
      return {
        ...state,
        state: {
          newsList: {data: []},
          favoritesNewsList: state.state.favoritesNewsList,
          deletedNewsList: state.state.deletedNewsList,
        },
        loading: false,
        fetched: false,
        error: error,
      };
    case NewsKind.FETCHING:
      return {
        ...state,
        state: {
          ...state.state,
          newsList: action.payload.newsList,
          favoritesNewsList: action.payload.favoritesNewsList,
          deletedNewsList: action.payload.deletedNewsList,
        },
        loading: true,
        fetched: false,
        error: error,
      };
    case NewsKind.FETCHED:
      const deletedNewsList = state.state.deletedNewsList;
      const listFiltered = action.payload.newsList.data.filter(newsListItem => {
        const exist = deletedNewsList?.some(
          item => item === newsListItem.storyId,
        );
        if (!exist) {
          return newsListItem;
        }
      });
      dataPayload = JSON.stringify({
        newsList: {data: listFiltered},
        favoritesNewsList: state.state.favoritesNewsList,
        deletedNewsList: state.state.deletedNewsList,
      });
      setSavedData(constants.HOME.STORAGE_KEY, dataPayload);

      return {
        ...state,
        state: {
          newsList: {data: listFiltered},
          favoritesNewsList: state.state.favoritesNewsList,
          deletedNewsList: state.state.deletedNewsList,
        },
        loading: false,
        fetched: true,
        error: error,
      };
    case NewsKind.REMOVE_NEWS:
      let deletedList: number[] = state.state.deletedNewsList;
      if (action.payload.deletedNewsId) {
        const exist = deletedList?.find(
          item => item === action.payload.deletedNewsId,
        );

        if (exist) {
          deletedList = deletedList.filter(item => item !== exist);
        } else {
          deletedList?.push(action.payload.deletedNewsId);
        }
      }

      dataPayload = JSON.stringify({
        newsList: state.state.newsList,
        deletedNewsList: deletedList,
        favoritesNewsList: state.state.favoritesNewsList,
      });

      setSavedData(constants.HOME.STORAGE_KEY, dataPayload);
      return {
        ...state,
        state: {
          ...state.state,
          newsList: state.state.newsList,
          deletedNewsList: deletedList,
          favoritesNewsList: state.state.favoritesNewsList,
        },
        loading: false,
        fetched: true,
        error: error,
      };
    case NewsKind.ADD_FAVORITES:
      let favoritesList: number[] = state.state.favoritesNewsList;
      if (action.payload.favoritesNewsId) {
        const exist = favoritesList?.find(
          item => item === action.payload.favoritesNewsId,
        );

        if (exist) {
          favoritesList = state.state.favoritesNewsList.filter(
            item => item !== exist,
          );
        } else {
          favoritesList?.push(action.payload.favoritesNewsId);
        }
      }

      dataPayload = JSON.stringify({
        ...state.state,
        favoritesNewsList: favoritesList,
      });
      setSavedData(constants.HOME.STORAGE_KEY, dataPayload);

      return {
        ...state,
        state: {
          ...state.state,
          favoritesNewsList: favoritesList,
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

import {NewsKind, NewsActions, StateStoreNewsData} from '../../entities';
import {setSavedData} from '../../../functions';

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
        if (!exist) return newsListItem;
      });
      dataPayload = JSON.stringify({
        newsList: {data: listFiltered},
        favoritesNewsList: state.state.favoritesNewsList,
        deletedNewsList: state.state.deletedNewsList,
      });
      setSavedData(dataPayload);

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
      const deletedList: number[] = state.state.deletedNewsList;
      if (action.payload.deletedNewsId) {
        deletedList?.push(action.payload.deletedNewsId);
      }

      const listFilteredByFetching = action.payload.newsList.data.filter(
        item => {
          const exist = !deletedList?.includes(item.storyId);

          if (exist) {
            return item;
          }
        },
      );
      dataPayload = JSON.stringify({
        newsList: {data: listFilteredByFetching},
        deletedNewsList: deletedList,
        favoritesNewsList: state.state.favoritesNewsList,
      });

      setSavedData(dataPayload);
      return {
        ...state,
        state: {
          ...state.state,
          newsList: {data: listFilteredByFetching},
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
      setSavedData(dataPayload);

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

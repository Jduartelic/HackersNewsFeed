import {NewsKind, NewsActions, StateStoreNewsData} from '../../entities';
import {setSavedData} from '../../../functions';
import {constants} from '../../../constants';
import {News, NewsData} from '../../../../domain';

const getDataMerge = (
  sourceList: NewsData[],
  dataList: NewsData[],
  addStoryId: Number,
) => {
  const news = sourceList.find(item => item.storyId === addStoryId);

  return {
    data: {
      ...dataList,
      ...news,
    },
  };
};

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
      let listFiltered: NewsData[] = action.payload.newsList.data;

      if (deletedNewsList.data && deletedNewsList.data.length) {
        listFiltered = action.payload.newsList.data.filter(newsListItem => {
          const exist = deletedNewsList?.data.some(
            item => item.storyId === newsListItem.storyId,
          );
          if (!exist) {
            return newsListItem;
          }
        });
      }

      dataPayload = JSON.stringify({
        newsList: listFiltered,
        favoritesNewsList: state.state.favoritesNewsList.data,
        deletedNewsList: state.state.deletedNewsList.data,
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
      let deletedList: News = state.state.deletedNewsList;
      if (action.payload.deletedNewsId && deletedList?.data) {
        const exist = deletedList?.data.some(
          item => item.storyId === action.payload.deletedNewsId,
        );

        if (exist) {
          deletedList.data = state.state.favoritesNewsList.data.filter(
            item => item.storyId !== action.payload.deletedNewsId,
          );
        } else {
          const news = state.state.newsList?.data.find(
            item => item.storyId === action.payload.deletedNewsId,
          );

          if (news) {
            deletedList.data.push(news);
          }
        }
      } else {
        const news = state.state.newsList?.data.find(
          item => item.storyId === action.payload.deletedNewsId,
        );

        if (news) {
          deletedList.data = [news];
        }
      }

      dataPayload = JSON.stringify({
        newsList: state.state.newsList,
        deletedNewsList: deletedList,
        favoritesNewsList: state.state.favoritesNewsList,
      });
      console.log('dataPayload antes de guardar favoritos', {
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
      let favoritesList: News = state.state.favoritesNewsList;

      if (action.payload.favoritesNewsId && favoritesList?.data) {
        const exist = favoritesList?.data.some(
          item => item.storyId === action.payload.favoritesNewsId,
        );

        if (exist) {
          favoritesList.data = state.state.favoritesNewsList.data.filter(
            item => item.storyId !== action.payload.favoritesNewsId,
          );
        } else {
          const news = state.state.newsList?.data.find(
            item => item.storyId === action.payload.favoritesNewsId,
          );

          if (news) {
            favoritesList.data.push(news);
          } // = {
          //   data: {
          //     ...favoritesList?.data,
          //     ...news,
          //   },
          // };
          // favoritesList = {
          //   data: {
          //     ...favoritesList?.data,
          //     ...news,
          //   },
          // };
        }
      } else {
        const news = state.state.newsList?.data.find(
          item => item.storyId === action.payload.favoritesNewsId,
        );

        if (news) {
          favoritesList.data = [news];
        }
      }

      dataPayload = JSON.stringify({
        ...state.state,
        favoritesNewsList: favoritesList,
      });

      console.log('dataPayload antes de guardar favoritos', {
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

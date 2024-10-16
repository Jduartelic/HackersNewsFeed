import {useCallback, useEffect, useRef, useContext} from 'react';
import {NewsRepository} from '../../../../infraestructure';
import {NewsContext, NewsKind} from '../../../stores/entities';

const useNews = () => {
  const mountedRef = useRef(true);
  const {dispatchNewsData, stateNewsData} = useContext(NewsContext);
  const {state} = stateNewsData;

  const getNewsList = useCallback(
    async (typePlatform: string) => {
      try {
        const response = await NewsRepository.getNews(typePlatform);
        dispatchNewsData({
          type: NewsKind.FETCHED,
          payload: {
            newsList: response.data.length ? response : state.newsList,
            deletedNewsList: state.deletedNewsList,
            favoritesNewsList: state.favoritesNewsList,
            favoritesNewsId: undefined,
            deletedNewsId: undefined,
          },
        });
      } catch (err: unknown) {
        return dispatchNewsData({
          type: NewsKind.FETCHED,
          payload: {
            newsList: state.newsList,
            deletedNewsList: state.deletedNewsList,
            favoritesNewsList: state.favoritesNewsList,
            favoritesNewsId: undefined,
            deletedNewsId: undefined,
          },
          error: err as Error,
        });
      }
    },
    [
      dispatchNewsData,
      state.deletedNewsList,
      state.favoritesNewsList,
      state.newsList,
    ],
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    mountedRef,
    getNewsList,
  };
};

export default useNews;

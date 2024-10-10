import {useCallback, useEffect, useRef, useContext} from 'react';
import {NewsRepository} from '../../../../infraestructure';
import {NewsContext, NewsKind} from '../../../stores/entities';

const useNews = () => {
  const mountedRef = useRef(true);
  const {dispatchNewsData} = useContext(NewsContext);

  const getNewsList = useCallback(
    async (typePlatform: string) => {
      try {
        const response = await NewsRepository.getNews(typePlatform);

        dispatchNewsData({
          type: NewsKind.FETCHED,
          payload: {
            newsList: response,
          },
        });
      } catch (err: unknown) {
        return dispatchNewsData({
          type: NewsKind.FETCHED,
          payload: {
            newsList: {data: []},
          },
          error: err as Error,
        });
      }
    },
    [dispatchNewsData],
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

import {NewsResponse, News} from '../../../domain';
import axios from 'axios';
import {apiConfig, mappers, NewsDto, Routes} from '../../../infraestructure';

const getNews: NewsResponse = async (typePlatform: string): Promise<News> => {
  const {data} = await axios.get<NewsDto>(
    `${apiConfig.apiUrl}${Routes.searchByDate}`,
    {
      params: {
        query: typePlatform,
      },
    },
  );
  return mappers.newsMap(data);
};

export default {getNews};

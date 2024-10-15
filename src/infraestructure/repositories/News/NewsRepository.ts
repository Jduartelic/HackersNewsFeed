import {NewsResponse, News} from '../../../domain';
import axios from 'axios';
import {apiConfig, mappers, NewsDto, Routes} from '../../../infraestructure';

const getNews: NewsResponse = async (typePlatform: string): Promise<News> => {
  const {data, request, config} = await axios.get<NewsDto>(
    `${apiConfig.apiUrl}${Routes.searchByDate}?query=${typePlatform}`,
  );
  return mappers.newsMap({hits: data.hits});
};

export default {getNews};

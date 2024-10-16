import Config from 'react-native-config';

type ApiType = {
  apiUrl: string;
};

export const apiConfig: ApiType = {
  apiUrl: Config.API_URL ?? 'https://hn.algolia.com/api/v1/',
};

import {DtoFixtures} from '../../dtos';
import NewsRepository from './NewsRepository';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockData = DtoFixtures.NewsDataSuccess;

describe('NewsRepository', () => {
  it('should test news repository function', async () => {
    mockedAxios.get.mockResolvedValue({
      data: mockData,
    });
    const result = await NewsRepository.getNews('');

    const firstItem = DtoFixtures.NewsDataSuccess.hits.find(
      item => item.story_id === result.data[0].storyId,
    );
    expect(result.data[0].storyId).toStrictEqual(firstItem?.story_id);
  });
});

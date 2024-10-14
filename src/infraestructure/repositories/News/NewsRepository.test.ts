import {Fixtures} from '../../../domain';
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

    expect(result.data[0].storyId).toStrictEqual(
      DtoFixtures.NewsDataSuccess.hits[0].story_id,
    );
  });
});

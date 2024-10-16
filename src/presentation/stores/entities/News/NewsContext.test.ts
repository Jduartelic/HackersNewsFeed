import {NewsKind, defaultNewsContextValues, StateStoreNewsData} from '..';
import {NewsDataReducer} from './reducer';
import {Fixtures} from '../../../../domain';
import {waitFor} from '@testing-library/react-native';

const mockStateStoreNewsData: StateStoreNewsData =
  defaultNewsContextValues.stateNewsData;
const mockNewsFixtures = Fixtures.NewsList;

describe('News reducer', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should call INITIAL_STATE type in News reducer', async () => {
    const result: void | StateStoreNewsData =
      defaultNewsContextValues.dispatchNewsData({
        type: NewsKind.INITIAL_STATE,
        payload: {
          ...mockStateStoreNewsData.state,
        },
        ...mockStateStoreNewsData,
      });
    await waitFor(
      async () => {
        const resultData = result as unknown as StateStoreNewsData;
        expect(resultData.state.newsList.data).toHaveLength(0);
      },
      {timeout: 1000},
    );
  });

  it('should call REMOVE_NEWS type in News reducer', async () => {
    const result = NewsDataReducer(
      {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
          deletedNewsList: Fixtures.SingularNews,
        },
      },
      {
        type: NewsKind.REMOVE_NEWS,
        payload: {
          ...mockStateStoreNewsData.state,
          deletedNewsList: Fixtures.SingularNews,
          deletedNewsId: Fixtures.NewsList.data[1].storyId,
        },
        loading: false,
        fetched: true,
        error: undefined,
      },
    );

    await waitFor(
      async () => {
        expect(result.state.deletedNewsList.data).toHaveLength(1);
      },
      {timeout: 1000},
    );
  });

  it('should call FETCHING type in News reducer', async () => {
    const result = NewsDataReducer(
      {
        ...mockStateStoreNewsData,
      },
      {
        type: NewsKind.FETCHING,
        payload: {
          ...mockStateStoreNewsData.state,
        },
        loading: true,
        fetched: false,
        error: undefined,
      },
    );

    await waitFor(
      async () => {
        expect(result.loading).toBeTruthy();
      },
      {timeout: 1000},
    );
  });

  it('should call FETCHED type in News reducer', async () => {
    const result = NewsDataReducer(
      {
        ...mockStateStoreNewsData,
      },
      {
        type: NewsKind.FETCHED,
        payload: {
          ...mockStateStoreNewsData.state,
          newsList: Fixtures.NewsList,
        },
        loading: false,
        fetched: true,
        error: undefined,
      },
    );

    await waitFor(
      async () => {
        expect(result.state.newsList.data).toHaveLength(
          Fixtures.NewsList.data.length,
        );
      },
      {timeout: 1000},
    );
  });

  it('should call ADD_FAVORITES type in News reducer', async () => {
    const result = NewsDataReducer(
      {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
          favoritesNewsList: Fixtures.SingularNews,
          newsList: Fixtures.NewsList,
        },
      },
      {
        type: NewsKind.ADD_FAVORITES,
        payload: {
          ...mockStateStoreNewsData.state,
          favoritesNewsList: Fixtures.SingularNews,
          favoritesNewsId: Fixtures.NewsList.data[2].storyId,
          newsList: mockNewsFixtures,
        },
        loading: false,
        fetched: true,
        error: undefined,
      },
    );

    await waitFor(
      async () => {
        expect(result.state.favoritesNewsList.data.length).toBeGreaterThan(0);
      },
      {timeout: 1000},
    );
  });

  it('should call DEFAULT type in News reducer', async () => {
    const result = NewsDataReducer(
      {
        ...mockStateStoreNewsData,
      },
      {
        type: NewsKind.DEFAULT,
        payload: {...mockStateStoreNewsData.state},
        loading: false,
        fetched: false,
        error: undefined,
      },
    );

    await waitFor(
      async () => {
        expect(result).toEqual(mockStateStoreNewsData);
      },
      {timeout: 1000},
    );
  });
});

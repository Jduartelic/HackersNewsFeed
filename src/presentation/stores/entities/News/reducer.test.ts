import {
  NewsKind,
  defaultNewsContextValues,
  StateStoreNewsData,
} from '../../entities';
import {NewsDataReducer} from './reducer';
import {Fixtures} from '../../../../domain';
import {waitFor} from '@testing-library/react-native';

const mockStateStoreNewsData: StateStoreNewsData =
  defaultNewsContextValues.stateNewsData;
const mockNewsFixtures = Fixtures.NewsList;
const mockSingular = Fixtures.SingularNews;

describe('News reducer', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('should call ADD_FAVORITES type in News reducer', async () => {
    const mockData = Fixtures.NewsList;
    const result = NewsDataReducer(
      {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
          favoritesNewsList: mockNewsFixtures,
        },
      },
      {
        type: NewsKind.ADD_FAVORITES,
        payload: {
          ...mockStateStoreNewsData.state,
          favoritesNewsList: mockData,
          favoritesNewsId: mockData.data[1].storyId,
          newsList: mockNewsFixtures,
        },
        loading: false,
        fetched: true,
        error: undefined,
      },
    );

    await waitFor(
      async () => {
        expect(result.state.favoritesNewsList.data).toHaveLength(
          mockNewsFixtures.data.length,
        );
      },
      {timeout: 1000},
    );
  });

  it('should call INITIAL_STATE type in News reducer', async () => {
    const result = NewsDataReducer(
      {
        ...mockStateStoreNewsData,
      },
      {
        type: NewsKind.INITIAL_STATE,
        payload: {
          ...mockStateStoreNewsData.state,
        },
        loading: false,
        fetched: false,
        error: undefined,
      },
    );

    await waitFor(
      async () => {
        expect(result.state).toStrictEqual(mockStateStoreNewsData.state);
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
          deletedNewsList: mockNewsFixtures,
        },
      },
      {
        type: NewsKind.REMOVE_NEWS,
        payload: {
          ...mockStateStoreNewsData.state,
          deletedNewsList: mockNewsFixtures,
          deletedNewsId: mockNewsFixtures.data[0].storyId,
        },
        loading: false,
        fetched: true,
        error: undefined,
      },
    );

    await waitFor(
      async () => {
        expect(result.state.deletedNewsList.data).toHaveLength(
          mockNewsFixtures.data.length,
        );
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

  it('should call ADD_FAVORITES type  without any favorites selected in News reducer', async () => {
    const result = NewsDataReducer(
      {
        ...mockStateStoreNewsData,
      },
      {
        type: NewsKind.ADD_FAVORITES,
        payload: {
          ...mockStateStoreNewsData.state,
          favoritesNewsList: {data: []},
          favoritesNewsId: undefined,
          newsList: mockNewsFixtures,
        },
        loading: false,
        fetched: true,
        error: undefined,
      },
    );

    await waitFor(
      async () => {
        expect(result.state.favoritesNewsList.data).toHaveLength(0);
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
  it('should call ADD_FAVORITES and state exist type in News reducer', async () => {
    console.log('mockSingular.data[0].storyId', mockSingular.data);
    const result = NewsDataReducer(
      {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
          favoritesNewsList: Fixtures.SingularNews,
        },
      },
      {
        type: NewsKind.ADD_FAVORITES,
        payload: {
          ...mockStateStoreNewsData.state,
          favoritesNewsList: mockSingular,
          favoritesNewsId: mockSingular.data[0].storyId,
          newsList: mockSingular,
        },
        loading: false,
        fetched: true,
        error: undefined,
      },
    );
    await waitFor(
      async () => {
        expect(result.state.favoritesNewsList.data).toHaveLength(0);
      },
      {timeout: 1000},
    );
  });
  it('should call REMOVE_NEWS and state exist type in News reducer', async () => {
    const result = NewsDataReducer(
      {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
          deletedNewsList: mockNewsFixtures,
          newsList: Fixtures.NewsList,
        },
      },
      {
        type: NewsKind.REMOVE_NEWS,
        payload: {
          ...mockStateStoreNewsData.state,
          deletedNewsList: mockNewsFixtures,
          deletedNewsId: 1230987,
        },
        loading: false,
        fetched: true,
        error: undefined,
      },
    );

    await waitFor(
      async () => {
        expect(result.state.deletedNewsList.data.length).toBeGreaterThan(0);
      },
      {timeout: 1000},
    );
  });

  it('should call and exist with deleted data on FETCHED type in News reducer', async () => {
    const result = NewsDataReducer(
      {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
          deletedNewsList: mockNewsFixtures,
          newsList: Fixtures.NewsList,
        },
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
        expect(result.state.newsList.data).toHaveLength(0);
      },
      {timeout: 1000},
    );
  });
});

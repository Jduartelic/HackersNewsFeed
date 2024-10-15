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

describe('News reducer', () => {
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => jest.clearAllMocks());

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
      },
      {
        type: NewsKind.REMOVE_NEWS,
        payload: {
          ...mockStateStoreNewsData.state,
          deletedNewsList: [mockNewsFixtures.data[0].storyId],
          deletedNewsId: mockNewsFixtures.data[0].storyId,
        },
        loading: false,
        fetched: true,
        error: undefined,
      },
    );

    await waitFor(
      async () => {
        expect(result.state.deletedNewsList).toHaveLength(1);
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
        expect(result.state.newsList.data).toHaveLength(1);
      },
      {timeout: 1000},
    );
  });

  it('should call ADD_FAVORITES type in News reducer', async () => {
    const result = NewsDataReducer(
      {
        ...mockStateStoreNewsData,
      },
      {
        type: NewsKind.ADD_FAVORITES,
        payload: {
          ...mockStateStoreNewsData.state,
          favoritesNewsList: [mockNewsFixtures.data[0].storyId],
          favoritesNewsId: mockNewsFixtures.data[0].storyId,
          newsList: mockNewsFixtures,
        },
        loading: false,
        fetched: true,
        error: undefined,
      },
    );

    await waitFor(
      async () => {
        expect(result.state.favoritesNewsList).toHaveLength(1);
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
          favoritesNewsList: [],
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
        expect(result.state.favoritesNewsList).toHaveLength(1);
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

  it('should call REMOVE_NEWS and state exist type in News reducer', async () => {
    const result = NewsDataReducer(
      {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
          deletedNewsList: [mockNewsFixtures.data[0].storyId],
        },
      },
      {
        type: NewsKind.REMOVE_NEWS,
        payload: {
          ...mockStateStoreNewsData.state,
          deletedNewsList: [mockNewsFixtures.data[0].storyId],
          deletedNewsId: mockNewsFixtures.data[0].storyId,
        },
        loading: false,
        fetched: true,
        error: undefined,
      },
    );

    await waitFor(
      async () => {
        expect(result.state.deletedNewsList).toHaveLength(0);
      },
      {timeout: 1000},
    );
  });

  it('should call ADD_FAVORITES and state exist type in News reducer', async () => {
    const result = NewsDataReducer(
      {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
          favoritesNewsList: [mockNewsFixtures.data[0].storyId],
        },
      },
      {
        type: NewsKind.ADD_FAVORITES,
        payload: {
          ...mockStateStoreNewsData.state,
          favoritesNewsList: [mockNewsFixtures.data[0].storyId],
          favoritesNewsId: mockNewsFixtures.data[0].storyId,
          newsList: mockNewsFixtures,
        },
        loading: false,
        fetched: true,
        error: undefined,
      },
    );
    await waitFor(
      async () => {
        expect(result.state.favoritesNewsList).toHaveLength(0);
      },
      {timeout: 1000},
    );
  });
});

import React, {useEffect, useContext, useCallback, useMemo} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  BackHandler,
} from 'react-native';
import {useNews} from '../../hooks';
import {
  NewsContext,
  NewsKind,
  NewsPayloadEntity,
  UserActivityContext,
  UserActivityEntity,
  UserActivityKind,
  defaultUserActivityContextValues,
} from '../../stores/entities';
import {NewsFeed} from '../../components/organisms';
import {SkeletonCardContainer} from '../../components/molecules';
import styles from './HomeScreen.styles';
import {constants} from '../../constants';
import uuid from 'react-native-uuid';
import {getSavedData} from '../../functions';
import {useNavigation} from '@react-navigation/native';
import {HackerNewsFeedStack} from '../../navigationContainer/navigationStack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {PushNotificationsHandler} from '../../components/HOC/';
type HackerNewsFeedNavigationProp =
  NativeStackNavigationProp<HackerNewsFeedStack>;

const HomeScreen = (): React.JSX.Element => {
  const {getNewsList} = useNews();
  const {HOME, USER_ACTIVITY, MAIN_COLOR} = constants;
  const {navigate, replace} = useNavigation<HackerNewsFeedNavigationProp>();
  const {dispatchNewsData, stateNewsData} = useContext(NewsContext);
  const {dispatchUserActivityData, stateUserActivityData} =
    useContext(UserActivityContext);
  const {loading, fetched, state, error} = stateNewsData;
  const {
    loading: loadingUserActivity,
    fetched: fetchedUserActivity,
    state: stateUserActivity,
  } = stateUserActivityData;
  if (error) console.log('error', error);

  const filteredListNews = useMemo(() => {
    const {deletedNewsList, newsList} = state;
    return {
      data: newsList.data.filter(
        item => !deletedNewsList.includes(item.storyId),
      ),
    };
  }, [state]);

  const getRandomId = useCallback((min: number, max: number): number => {
    const val = Math.floor(Math.random() * (max - min + 1)) + min;
    return val;
  }, []);

  const onFetchingNews = useCallback(async () => {
    let dataPayload: NewsPayloadEntity = {
      newsList: {data: []},
      deletedNewsList: [],
      favoritesNewsList: [],
    };

    const dataFromStorage = await getSavedData(constants.HOME.STORAGE_KEY);
    if (dataFromStorage) {
      const data = JSON.parse(dataFromStorage);

      dataPayload.newsList = data.newsList;
      dataPayload.deletedNewsList = data.deletedNewsList ?? [];
      dataPayload.favoritesNewsList = data.favoritesNewsList ?? [];
    }

    dispatchNewsData({
      type: NewsKind.FETCHING,
      payload: {
        newsList: dataPayload.newsList,
        favoritesNewsId: undefined,
        deletedNewsId: undefined,
        deletedNewsList: dataPayload.deletedNewsList,
        favoritesNewsList: dataPayload.favoritesNewsList,
      },
    });
  }, [dispatchNewsData]);

  const onFetchingUserActivity = useCallback(async () => {
    getSavedData(constants.USER_ACTIVITY.STORAGE_KEY).then(savedData => {
      const parseLocalFacets: UserActivityEntity = savedData
        ? JSON.parse(savedData)
        : {
            facets: constants.USER_ACTIVITY.FACETS.keywords.technology,
            facetsSelectedByUser: [],
            querySearch: '',
            hasSeenOnboarding: false,
            pushNotifications: {
              appStateActivity:
                defaultUserActivityContextValues.stateUserActivityData.state
                  .pushNotifications.appStateActivity,
              sentPushNotification: false,
              timeForNextPush: 6000,
            },
            userName: '',
          };

      dispatchUserActivityData({
        type: UserActivityKind.FETCHED,
        payload: {
          facets: parseLocalFacets.facets,
          facetsSelectedByUser: parseLocalFacets.facetsSelectedByUser,
          hasSeenOnboarding: parseLocalFacets.hasSeenOnboarding,
          querySearch: parseLocalFacets.querySearch,
          userName: parseLocalFacets.userName,
          pushNotifications: parseLocalFacets.pushNotifications,
        },
      });
    });
    constants.USER_ACTIVITY.STORAGE_KEY;
    dispatchUserActivityData({
      type: UserActivityKind.FETCHING,
      payload: {
        ...defaultUserActivityContextValues.stateUserActivityData.state,
      },
    });
  }, [dispatchUserActivityData]);

  useEffect(() => {
    if (!loadingUserActivity && !fetchedUserActivity) {
      onFetchingUserActivity();
    }
  }, [loadingUserActivity, fetchedUserActivity, onFetchingUserActivity]);

  useEffect(() => {
    if (loading && !fetched) {
      const idKeyword = getRandomId(0, 5);
      const facetKeyword = Object.values(USER_ACTIVITY.FACETS.keywords).find(
        (_, index) => index === idKeyword,
      ) ?? ['Android'];
      const queryParam = facetKeyword[getRandomId(0, facetKeyword.length - 1)];
      getNewsList(queryParam);
    }
  }, [
    loading,
    fetched,
    getNewsList,
    stateUserActivity.querySearch,
    USER_ACTIVITY.FACETS.keywords,
    getRandomId,
  ]);

  useEffect(() => {
    if (
      !loading &&
      !fetched &&
      !loadingUserActivity &&
      fetchedUserActivity &&
      stateUserActivity.hasSeenOnboarding
    ) {
      onFetchingNews();
    }
  }, [
    onFetchingNews,
    loading,
    fetched,
    loadingUserActivity,
    fetchedUserActivity,
    stateUserActivity.hasSeenOnboarding,
  ]);

  useEffect(() => {
    if (!stateUserActivity.hasSeenOnboarding && fetchedUserActivity) {
      replace('OnboardingScreen');
    }
  }, [
    navigate,
    stateUserActivity.hasSeenOnboarding,
    fetchedUserActivity,
    replace,
  ]);

  BackHandler.addEventListener('hardwareBackPress', function () {
    return false;
  });

  const renderSkeleton = () => {
    let skeletonArray = Array.from(
      {length: HOME.NUMBER_SKELETON},
      (_, index) => index,
    );
    return (
      <ScrollView
        contentContainerStyle={styles.scrollViewSkeleton}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}>
        {skeletonArray.map(() => {
          return (
            <View style={styles.mainContainer} key={uuid.v4().toString()}>
              <SkeletonCardContainer isLoading={loading} />
            </View>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView testID="home-screen-container" style={styles.mainContainer}>
      <PushNotificationsHandler>
        <StatusBar barStyle={'dark-content'} backgroundColor={MAIN_COLOR} />
        {loading && renderSkeleton()}
        {!loading && <NewsFeed newsDataList={filteredListNews} />}
      </PushNotificationsHandler>
    </SafeAreaView>
  );
};

export default HomeScreen;

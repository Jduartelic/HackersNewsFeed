import React, {useContext, useMemo} from 'react';
import {View, Text, Image, LayoutChangeEvent} from 'react-native';
import {NewsData, images} from '../../../../domain';
import styles from './NewsCard.styles';
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from 'date-fns';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  Pressable,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  HackerNewsFeedStack,
  HackerNewsFeedDrawer,
} from '../../../navigationContainer/navigationStack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {NewsContext, NewsKind} from '../../../stores/entities';
import {differenceInCalendarYears} from 'date-fns/fp';
import uuid from 'react-native-uuid';

const SIZE = 120;
const BOUNDARY_OFFSET = 50;

type HackerNewsFeedNavigationProp =
  NativeStackNavigationProp<HackerNewsFeedStack>;

type HackerNewsFeedDrawerNavigationProp =
  NativeStackNavigationProp<HackerNewsFeedDrawer>;

export const NewsCard = (newsData: NewsData) => {
  const {dispatchNewsData, stateNewsData} = useContext(NewsContext);
  const {navigate} = useNavigation<HackerNewsFeedNavigationProp>();
  const {getState} = useNavigation<HackerNewsFeedDrawerNavigationProp>();
  const {state} = stateNewsData;
  const stateNav = getState();
  const isCemeteryScreen =
    stateNav.routes[stateNav.index].name === 'CemeteryNewsScreen';
  const newsDate = newsData.createdAtI;
  const date = new Date(newsDate * 1000);
  const currentDate = new Date();
  const result = `${differenceInMinutes(currentDate, date)}m`;
  const resultInHour =
    Number(result.replace('m', '')) > 59
      ? `${differenceInHours(currentDate, date)}h`
      : result;
  const resultInDays =
    Number(result.replace('h', '')) > 24
      ? `${differenceInDays(currentDate, date)}d`
      : resultInHour;

  const offset = useSharedValue<number>(0);
  const width = useSharedValue<number>(0);

  const onLayout = (event: LayoutChangeEvent) => {
    width.value = event.nativeEvent.layout.width;
  };

  const pan = Gesture.Pan()
    .onChange(event => {
      offset.value += event.changeX;

      if (0.1 < offset.value) {
        offset.value = 0;
      }
    })
    .onFinalize(event => {
      offset.value = withDecay({
        velocity: event.velocityX,
        rubberBandEffect: false,
        clamp: [-(width.value / 2) + SIZE / 2 + BOUNDARY_OFFSET, 0],
      });
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateX: offset.value}],
  }));

  const animatedWidthTapStyles = useAnimatedStyle(() => ({
    width: -70 > offset.value ? '100%' : '30%',
  }));

  const animatedStylesZindexRight = useAnimatedStyle(() => ({
    zIndex: -70 > offset.value ? 100 : 0,
  }));

  const navigateWebView = () => {
    if (newsData.storyUrl) {
      navigate('WebViewScreen', {url: newsData.storyUrl});
    }
  };

  const isSelected = useMemo(() => {
    if (state.favoritesNewsList.length) {
      return state.favoritesNewsList.some(item => item === newsData.storyId);
    }
    return false;
  }, [state.favoritesNewsList, newsData.storyId]);
  return (
    <GestureHandlerRootView
      key={uuid.v4().toString()}
      style={styles.cardContainer}>
      <>
        <Animated.View
          testID="main-container"
          style={[styles.containerTrashButton, animatedStylesZindexRight]}>
          <View style={styles.trashButton}>
            <Pressable
              testID="trash-button"
              onPress={() => {
                offset.value = withTiming(100);
                dispatchNewsData({
                  type: NewsKind.REMOVE_NEWS,
                  payload: {
                    newsList: state.newsList,
                    deletedNewsList: state.deletedNewsList,
                    favoritesNewsList: state.favoritesNewsList,
                    deletedNewsId: newsData.storyId,
                  },
                });
              }}>
              <Icon
                name={isCemeteryScreen ? 'folder-plus' : 'trash'}
                size={30}
                color={isCemeteryScreen ? '#009000' : '#D3D3D3'}
              />
            </Pressable>
          </View>
        </Animated.View>
      </>
      <View testID="layout-provider" onLayout={onLayout}>
        <GestureDetector gesture={pan}>
          <>
            <Animated.View
              style={[
                styles.tapContainer,
                animatedStyles,
                animatedWidthTapStyles,
              ]}>
              {!isCemeteryScreen && (
                <View style={styles.containerFavoritesbutton}>
                  <Icon
                    testID="heart-button"
                    name="heart"
                    size={30}
                    color={isSelected ? '#df1b1b' : '#000'}
                    solid={isSelected ? true : false}
                    onPress={() => {
                      offset.value = withTiming(0);
                      dispatchNewsData({
                        type: NewsKind.ADD_FAVORITES,
                        payload: {
                          newsList: state.newsList,
                          deletedNewsList: state.deletedNewsList,
                          favoritesNewsList: state.favoritesNewsList,
                          favoritesNewsId: newsData.storyId,
                        },
                      });
                    }}
                  />
                </View>
              )}
            </Animated.View>
          </>
        </GestureDetector>
        <Animated.View style={[styles.innerCardContainer, animatedStyles]}>
          <View style={styles.cardHeaderContainer}>
            <Image
              source={images.logoImageIcon}
              style={styles.imageContainer}
            />

            <View style={styles.cardBodyContainer}>
              <Pressable testID="body-card" onPress={navigateWebView}>
                <Text style={styles.textStoryTitle}>{newsData.storyTitle}</Text>
              </Pressable>
            </View>
            <View style={styles.cardFooterContainer} />
          </View>
          <View style={styles.cardFooterContainer}>
            <Text>{`Author: ${newsData.author} - ${resultInDays}`}</Text>
          </View>
        </Animated.View>
      </View>
    </GestureHandlerRootView>
  );
};

export default NewsCard;

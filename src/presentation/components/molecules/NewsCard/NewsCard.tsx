import React, {useContext, useMemo, useCallback} from 'react';
import {View, Text, Image, PanResponder, LayoutChangeEvent} from 'react-native';
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
import {HackerNewsFeedStack} from '../../../navigationContainer/navigationStack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {NewsContext, NewsKind} from '../../../stores/entities';

const SIZE = 120;
const BOUNDARY_OFFSET = 50;

type HackerNewsFeedNavigationProp =
  NativeStackNavigationProp<HackerNewsFeedStack>;

export const NewsCard = (newsData: NewsData) => {
  const {dispatchNewsData, stateNewsData} = useContext(NewsContext);
  const {navigate} = useNavigation<HackerNewsFeedNavigationProp>();
  const {state, loading} = stateNewsData;
  const newsDate = newsData.createdAt ?? newsData.createdAtI;
  const date = newsDate ? new Date(newsDate) : '';
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
    width: -70 > offset.value ? '100%' : '7%',
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
    return state.favoritesNewsList.some(item => item === newsData.storyId);
  }, [state.favoritesNewsList, newsData.storyId]);

  // const existInFavoritesList = () => {
  //   console.log('isSelected', isSelected);
  //   if (isSelected) {
  //     return 'none';
  //   } else return 'auto';
  // };

  const existInFavoritesList = useCallback(() => {
    if (isSelected) {
      return 'none';
    } else {
      return 'auto';
    }
  }, [isSelected]);

  return (
    <GestureHandlerRootView style={styles.cardContainer}>
      <>
        <Animated.View
          style={[styles.containerTrashButton, animatedStylesZindexRight]}>
          <View style={styles.trashButton}>
            <Pressable
              onPress={() => {
                offset.value = withTiming(100);
                dispatchNewsData({
                  type: NewsKind.REMOVE_NEWS,
                  payload: {
                    newsList: state.newsList,
                    // favoritesNewsId: undefined,
                    deletedNewsId: newsData.storyId,
                  },
                });
              }}>
              <Icon name="trash" size={30} color="#df1b1b" />
            </Pressable>
          </View>
        </Animated.View>
      </>
      <View onLayout={onLayout} style={{zIndex: 0}}>
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.tapContainer,
              animatedStyles,
              animatedWidthTapStyles,
            ]}
          />
        </GestureDetector>
        <Animated.View style={[styles.innerCardContainer, animatedStyles]}>
          <View style={styles.cardHeaderContainer}>
            <Image
              source={images.logoImageIcon}
              style={{height: 50, width: 50, borderRadius: 100}}
            />

            <View style={{flex: 1}}>
              <Pressable onPress={navigateWebView}>
                <Text>{newsData.storyTitle}</Text>
              </Pressable>
            </View>

            <View
              pointerEvents={existInFavoritesList()}
              style={styles.containerFavoritesbutton}>
              <Pressable
                hitSlop={30}
                onPress={() => {
                  console.log('presione heart');
                  offset.value = withTiming(0);
                  dispatchNewsData({
                    type: NewsKind.ADD_FAVORITES,
                    payload: {
                      newsList: state.newsList,
                      favoritesNewsId: newsData.storyId,
                    },
                  });
                }}>
                <Icon
                  name="heart"
                  size={30}
                  color={isSelected ? '#df1b1b' : '#000'}
                  solid={isSelected ? true : false}
                />
              </Pressable>
            </View>
          </View>
          <View style={styles.cardFooterContainer}>
            <Text>{`${newsData.author} - ${resultInDays}`}</Text>
          </View>
        </Animated.View>
      </View>
    </GestureHandlerRootView>
  );
};

export default NewsCard;

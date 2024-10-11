import React, {Fragment, useRef, useState} from 'react';
import {View, Text, Image, PanResponder, LayoutChangeEvent} from 'react-native';
import {NewsData, images} from '../../../../domain';
import styles from './NewsCard.styles';
import {
  format,
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

const SIZE = 120;
const BOUNDARY_OFFSET = 50;

export const NewsCard = (newsData: NewsData) => {
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
    })
    .onFinalize(event => {
      offset.value = withDecay({
        velocity: event.velocityX,
        rubberBandEffect: false,
        clamp: [
          -(width.value / 2) + SIZE / 2 + BOUNDARY_OFFSET,
          width.value / 2 - SIZE / 2 - BOUNDARY_OFFSET,
        ],
      });
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateX: offset.value}],
  }));

  const animatedStylesZindexleft = useAnimatedStyle(() => ({
    zIndex: offset.value > 70 ? 100 : 0,
  }));

  const animatedStylesZindexRight = useAnimatedStyle(() => ({
    zIndex: -70 > offset.value ? 100 : 0,
  }));

  return (
    <GestureHandlerRootView style={styles.cardContainer}>
      <>
        <Animated.View
          style={[styles.containerFavoritesbutton, animatedStylesZindexleft]}>
          <View style={styles.favoritesbutton}>
            <Pressable
              style={{zIndex: 200}}
              onPress={() => {
                offset.value = withTiming(0);
              }}>
              <Icon name="heart" size={30} color="#000" />
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View
          style={[styles.containerTrashButton, animatedStylesZindexRight]}>
          <View style={styles.trashButton}>
            <Pressable
              onPress={() => {
                offset.value = withTiming(0);
              }}>
              <Icon name="trash" size={30} color="#000" />
            </Pressable>
          </View>
        </Animated.View>
      </>
      <View onLayout={onLayout} style={{zIndex: 0}}>
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.innerCardContainer, animatedStyles]}>
            <View style={styles.cardHeaderContainer}>
              <Image
                source={images.logoImageIcon}
                style={{height: 50, width: 50, borderRadius: 100}}
              />

              <View style={{flex: 1}}>
                <Text>{newsData.storyTitle}</Text>
              </View>
            </View>
            <View style={styles.cardFooterContainer}>
              <Text>{`${newsData.author} - ${resultInDays}`}</Text>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

export default NewsCard;

import React, {useRef, useState} from 'react';
import {View, Text, Image, PanResponder} from 'react-native';
import {NewsData, images} from '../../../../domain';
import styles from './NewsCard.styles';
import {
  format,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from 'date-fns';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

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

  const pressed = useSharedValue<boolean>(false);

  const offset = useSharedValue<number>(0);
  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
    })
    .onChange(event => {
      offset.value = event.translationX;
    })
    .onTouchesUp(() => {
      offset.value = withSpring(0);
      pressed.value = false;
    })
    .onFinalize(() => {
      offset.value = withSpring(0);
      pressed.value = false;
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {translateX: offset.value},
      // {scale: withTiming(pressed.value ? 1.2 : 1)},
    ],
    backgroundColor: pressed.value ? '#FFE04B' : '#b58df1',
  }));
  const randomColor = '#000000'.replace(/0/g, function () {
    return (~~(Math.random() * 16)).toString(16);
  });
  return (
    <GestureHandlerRootView style={styles.cardContainer}>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          minHeight: 99,
          // height: '80%',
          backgroundColor: randomColor,
          zIndex: 0,
          top: 16,
          left: 16,
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'flex-end',
          // bottom: -32,
          // paddingHorizontal: 16,
        }}>
        <Text>BORRAR</Text>
      </View>
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
    </GestureHandlerRootView>
  );
};

export default NewsCard;

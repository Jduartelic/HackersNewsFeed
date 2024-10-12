import React, {Fragment, useRef, useState} from 'react';
import {
  View,
  ImageSourcePropType,
  Text,
  Image,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';
import {NewsData, images} from '../../../../domain';
import styles from './MainHeader.styles';
import Icon, {
  FontAwesome5IconProps,
} from 'react-native-vector-icons/FontAwesome5';
import {HackerNewsFeedStack} from '../../../navigationContainer/navigationStack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

type HackerNewsFeedNavigationProp =
  NativeStackNavigationProp<HackerNewsFeedStack>;

export const MainHeader = ({
  iconLeft,
  imageSource,
  iconRight,
}: {
  iconLeft: FontAwesome5IconProps;
  imageSource?: ImageSourcePropType;
  iconRight?: FontAwesome5IconProps;
}) => {
  const {navigate} = useNavigation<HackerNewsFeedNavigationProp>();

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        <Icon name={iconLeft.name} size={30} color="#000" solid={false} />
        {imageSource && (
          <Image
            source={imageSource}
            style={{
              height: 60,
              width: 60,
              borderRadius: 100,
            }}
            resizeMode="cover"
          />
        )}
        {iconRight && (
          <Icon name={iconRight.name} size={30} color="#5ce1e6" solid={true} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default MainHeader;

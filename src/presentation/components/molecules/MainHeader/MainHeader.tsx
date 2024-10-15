import React, {useMemo, useContext, useEffect, useRef} from 'react';
import {View, ImageSourcePropType, Image, Keyboard} from 'react-native';
import styles from './MainHeader.styles';
import Icon, {
  FontAwesome5IconProps,
} from 'react-native-vector-icons/FontAwesome5';
import {
  HackerNewsFeedStack,
  HackerNewsFeedDrawer,
} from '../../../navigationContainer/navigationStack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {
  NewsContext,
  NewsKind,
  UserActivityContext,
  UserActivityKind,
} from '../../../stores/entities';
import {SearchBar} from '../../molecules';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  Pressable,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
  Easing,
  ReduceMotion,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';

type HackerNewsFeedNavigationProp =
  NativeStackNavigationProp<HackerNewsFeedStack>;
type HackerNewsFeedDrawerNavigationProp =
  DrawerNavigationProp<HackerNewsFeedDrawer>;

export const MainHeader = ({
  iconLeft,
  imageSource,
  iconRight,
}: {
  iconLeft: FontAwesome5IconProps;
  imageSource?: ImageSourcePropType;
  iconRight?: FontAwesome5IconProps;
}) => {
  const {stateNewsData, dispatchNewsData} = useContext(NewsContext);
  const {error, state, loading} = stateNewsData;
  const {stateUserActivityData, dispatchUserActivityData} =
    useContext(UserActivityContext);
  const {state: stateUserActivity} = stateUserActivityData;
  const {navigate, getState, goBack, isFocused} =
    useNavigation<HackerNewsFeedNavigationProp>();
  const {toggleDrawer} = useNavigation<HackerNewsFeedDrawerNavigationProp>();
  const isScreenFocused = isFocused();
  const routeStateScreen = useMemo(() => {
    const state = getState();
    return state.routes[state.index].name;
  }, [getState]);

  useEffect(() => {
    if (error && isScreenFocused) {
      dispatchNewsData({
        type: NewsKind.FETCHED,
        payload: {
          ...state,
        },
        error: undefined,
      });
      navigate('ErrorboundaryScreen');
    }
  }, [error, isScreenFocused, navigate]);

  const onPressSearchBar = () => {
    if (!pressed.value) {
      if (stateUserActivity.querySearch) {
        dispatchNewsData({
          type: NewsKind.FETCHING,
          payload: {
            ...state,
          },
          error: undefined,
        });
        dispatchUserActivityData({
          type: UserActivityKind.SAVE_INPUT,
          payload: {
            ...stateUserActivity,
            querySearch: '',
          },
        });
      }
    }
  };

  const pressed = useSharedValue<boolean>(false);
  const tap = Gesture.Tap().onBegin(() => {
    pressed.value = !pressed.value;
  });

  const animatedStyles = useAnimatedStyle(() => ({
    width: withTiming(pressed.value ? '100%' : '0%', {
      duration: 250,
      easing: Easing.inOut(Easing.quad),
      reduceMotion: ReduceMotion.Never,
    }),
    opacity: withTiming(pressed.value ? 1 : 0, {
      duration: 100,
      easing: Easing.inOut(Easing.quad),
      reduceMotion: ReduceMotion.Never,
    }),
  }));

  const animatedStylesHeaderContainer = useAnimatedStyle(() => ({
    width: withTiming(pressed.value ? '0%' : '100%', {
      duration: 250,
      easing: Easing.inOut(Easing.linear),
      reduceMotion: ReduceMotion.Never,
    }),
    opacity: withTiming(pressed.value ? 0 : 1, {
      duration: 0,
      easing: Easing.inOut(Easing.linear),
      reduceMotion: ReduceMotion.Never,
    }),
  }));

  return (
    <SafeAreaView>
      <GestureHandlerRootView style={styles.mainContainer}>
        <View style={styles.mainInnerContainer}>
          <Animated.View
            testID="main-header"
            style={[animatedStylesHeaderContainer, styles.innerContainer]}>
            <View style={styles.drawerIconContainer}>
              {isScreenFocused && (
                <Icon
                  testID="button-left-header"
                  name={iconLeft.name}
                  size={30}
                  color="#000"
                  solid={false}
                  onPress={() => {
                    if (routeStateScreen === 'HomeScreen') {
                      toggleDrawer();
                    } else {
                      goBack();
                    }
                  }}
                />
              )}
            </View>
            <View style={styles.imageContainer}>
              {isScreenFocused && imageSource && (
                <Image
                  source={imageSource}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}
            </View>
          </Animated.View>
          <Animated.View style={[styles.searchBarContainer, animatedStyles]}>
            <SearchBar />
          </Animated.View>
        </View>
        <View style={styles.containerSearchBarIcon}>
          {isScreenFocused && iconRight && (
            <GestureDetector gesture={tap}>
              <Icon
                testID="button-right-header"
                name={'search'}
                size={30}
                color={'#000'}
                solid={true}
                onPress={onPressSearchBar}
              />
            </GestureDetector>
          )}
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default MainHeader;

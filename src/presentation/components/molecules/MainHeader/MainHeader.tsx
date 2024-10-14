import React, {useMemo} from 'react';
import {View, ImageSourcePropType, Image} from 'react-native';
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
  const {navigate, getState, goBack} =
    useNavigation<HackerNewsFeedNavigationProp>();
  const {toggleDrawer} = useNavigation<HackerNewsFeedDrawerNavigationProp>();

  const routeStateScreen = useMemo(() => {
    const state = getState();
    return state.routes[state.index].name;
  }, [getState]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View testID="main-header" style={styles.innerContainer}>
        <View>
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
        </View>
        <View>
          {imageSource && (
            <Image
              source={imageSource}
              style={styles.imageContainer}
              resizeMode="cover"
            />
          )}
        </View>
        <View>
          {iconRight && (
            <Icon
              testID="button-right-header"
              name={iconRight.name}
              size={30}
              color="#5ce1e6"
              solid={true}
              onPress={() => navigate('FavoritesScreen')}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MainHeader;

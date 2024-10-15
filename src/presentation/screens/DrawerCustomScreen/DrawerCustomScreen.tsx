import React, {useContext} from 'react';
import {SafeAreaView, Image, StatusBar, Text, Pressable} from 'react-native';
import styles from './DrawerCustomScreen.styles';
import {constants} from '../../constants';
import {images} from '../../../domain';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HackerNewsFeedStack} from '../../navigationContainer/navigationStack';
import {useNavigation} from '@react-navigation/native';
import {NewsContext} from '../../stores/entities';

type HackerNewsFeedNavigationProp =
  NativeStackNavigationProp<HackerNewsFeedStack>;

const DrawerCustomScreen = (): React.JSX.Element => {
  const {MAIN_COLOR} = constants;
  const {navigate, goBack} = useNavigation<HackerNewsFeedNavigationProp>();
  const {stateNewsData} = useContext(NewsContext);
  const anyRemoveNews = stateNewsData.state.deletedNewsList.length > 0;
  const anyFavoritesNews = stateNewsData.state.favoritesNewsList.length > 0;
  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle={'dark-content'} backgroundColor={MAIN_COLOR} />
      <Pressable
        testID="button-go-back"
        onPress={() => goBack()}
        style={styles.mainContainerLogo}>
        <Image source={images.mainLogo} style={styles.imageContainer} />
      </Pressable>
      <Pressable
        testID="button-cemetery"
        onPress={() => anyRemoveNews && navigate('CemeteryNewsScreen')}
        style={styles.paddingContainer}>
        <Text
          style={
            anyRemoveNews
              ? styles.textFacetsInterest
              : styles.textFacetsInterestDisabled
          }>
          {'The Cemetery'}
        </Text>
      </Pressable>
      <Pressable
        testID="button-favorites"
        onPress={() => anyFavoritesNews && navigate('FavoritesScreen')}
        style={styles.paddingContainer}>
        <Text
          style={
            anyFavoritesNews
              ? styles.textFacetsInterest
              : styles.textFacetsInterestDisabled
          }>
          {'The Favorites'}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default DrawerCustomScreen;

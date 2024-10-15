import React, {useContext} from 'react';
import {
  SafeAreaView,
  Image,
  StatusBar,
  View,
  Text,
  Pressable,
} from 'react-native';
import {UserActivityContext} from '../../stores/entities';
import styles from './DrawerCustomScreen.styles';
import {constants} from '../../constants';
import {images} from '../../../domain';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HackerNewsFeedDrawer} from '../../navigationContainer/navigationStack';
import {useNavigation} from '@react-navigation/native';

type HackerNewsFeedNavigationProp =
  NativeStackNavigationProp<HackerNewsFeedDrawer>;

const DrawerCustomScreen = (): React.JSX.Element => {
  const {navigate, goBack} = useNavigation<HackerNewsFeedNavigationProp>();
  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <Pressable onPress={() => goBack()} style={styles.mainContainerLogo}>
        <Image source={images.mainLogo} style={styles.imageContainer} />
      </Pressable>
      <Pressable
        onPress={() => navigate('CemeteryNewsScreen')}
        style={styles.paddingContainer}>
        <Text style={styles.textFacetsInterest}>{'The Cemetery'}</Text>
      </Pressable>
      <Pressable
        onPress={() => navigate('FavoritesScreen')}
        style={styles.paddingContainer}>
        <Text style={styles.textFacetsInterest}>{'The Favorites'}</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default DrawerCustomScreen;

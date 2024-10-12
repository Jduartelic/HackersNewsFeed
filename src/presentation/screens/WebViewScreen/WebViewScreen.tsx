import React, {useRef} from 'react';
import {BackHandler, StatusBar, View, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import {HackerNewsFeedStack} from '../../navigationContainer/navigationStack';
import {useNavigation} from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import styles from './WebViewScreen.styles';
import uuid from 'react-native-uuid';

type Props = NativeStackScreenProps<HackerNewsFeedStack, 'WebViewScreen'>;

type HackerNewsFeedNavigationProp =
  NativeStackNavigationProp<HackerNewsFeedStack>;

const WebViewScreen = ({route, navigation}: Props) => {
  const {goBack} = useNavigation<HackerNewsFeedNavigationProp>();
  const isFocused = navigation.isFocused();
  const webViewRef = useRef<WebView>(null);
  const {url} = route.params;

  const handleBackButton = () => {
    goBack();
  };

  BackHandler.addEventListener('hardwareBackPress', function () {
    if (isFocused) {
      handleBackButton();
      return true;
    }
    return false;
  });

  return (
    <SafeAreaView
      testID="web-view-container"
      style={styles.mainContainer}
      edges={{bottom: 'off'}}>
      <StatusBar
        animated={true}
        barStyle="dark-content"
        backgroundColor={'#fff'}
      />
      <WebView
        testID="web-view"
        key={uuid.v4().toString()}
        ref={webViewRef}
        source={{
          uri: url,
        }}
        startInLoadingState={true}
        renderLoading={() => {
          return (
            <View style={styles.webViewLoadingContainer}>
              <ActivityIndicator
                testID="activity-indicator-web-view-screen"
                size="large"
              />
            </View>
          );
        }}
        style={styles.webViewContainer}
        javaScriptEnabled
        scalesPageToFit
        onLoadEnd={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          const {title: titlePage} = nativeEvent;
          if (!titlePage.trim()) {
            webViewRef.current?.stopLoading();
            webViewRef.current?.reload();
          }
        }}
      />
    </SafeAreaView>
  );
};

export default WebViewScreen;

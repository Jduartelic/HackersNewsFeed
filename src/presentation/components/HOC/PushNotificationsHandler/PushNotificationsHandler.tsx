import React, {
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  AppState,
  Platform,
  Modal,
  Text,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNews} from '../../../hooks';
import {
  NewsContext,
  NewsKind,
  NewsPayloadEntity,
  UserActivityContext,
  UserActivityEntity,
  UserActivityKind,
} from '../../../stores/entities';
import {NewsFeed} from '../../organisms';
import {constants} from '../../../constants';
import uuid from 'react-native-uuid';
import {getSavedData} from '../../../functions';
import {useNavigation} from '@react-navigation/native';
import {HackerNewsFeedStack} from '../../../navigationContainer/navigationStack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AuthorizationStatus,
  EventType,
} from '@notifee/react-native';
import {Linking} from 'react-native';
import styles from './PushNotificationsHandler.styles';
import Icon from 'react-native-vector-icons/FontAwesome5';

type HackerNewsFeedNavigationProp =
  NativeStackNavigationProp<HackerNewsFeedStack>;

const PushNotificationsHandler = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
  const [modalVisible, setModalVisible] = useState(false);
  const {getNewsList} = useNews();
  const {ONBOARDING, USER_ACTIVITY} = constants;
  const {
    RECONSIDER_PUSH_NOTIFICATIONS_PERMISSION,
    RECONSIDER_PUSH_NOTIFICATIONS_PERMISSION_TITLE,
  } = USER_ACTIVITY;
  const {CONTINUE} = ONBOARDING;
  const {navigate} = useNavigation<HackerNewsFeedNavigationProp>();
  const {dispatchNewsData, stateNewsData} = useContext(NewsContext);
  const {dispatchUserActivityData, stateUserActivityData} =
    useContext(UserActivityContext);
  const {loading, fetched, state} = stateNewsData;
  const {
    loading: loadingUserActivity,
    fetched: fetchedUserActivity,
    state: stateUserActivity,
  } = stateUserActivityData;
  const {appStateActivity, sentPushNotification, timeForNextPush} =
    stateUserActivity.pushNotifications;

  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    // await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      visibility: AndroidVisibility.PUBLIC,
      importance: AndroidImportance.HIGH,
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  const onRequestingPremission = useCallback(async () => {
    const settings = await notifee.requestPermission();
    if (Platform.OS === 'ios') {
      if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
        console.log('User denied permissions request');
        setModalVisible(true);
        // await notifee.requestPermission();
      } else if (
        settings.authorizationStatus === AuthorizationStatus.AUTHORIZED
      ) {
        console.log('User granted permissions request');
      } else if (
        settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
      ) {
        console.log('User provisionally granted permissions request');
      }
    }
    // else {
    //   const batteryOptimizationEnabled =
    //     await notifee.isBatteryOptimizationEnabled();
    //   if (batteryOptimizationEnabled) {
    //     // 2. ask your users to disable the feature
    //     Alert.alert(
    //       'Restrictions Detected',
    //       'To ensure notifications are delivered, please disable battery optimization for the app.',
    //       [
    //         // 3. launch intent to navigate the user to the appropriate screen
    //         {
    //           text: 'OK, open settings',
    //           onPress: async () =>
    //             await notifee.openBatteryOptimizationSettings(),
    //         },
    //         {
    //           text: 'Cancel',
    //           onPress: () => console.log('Cancel Pressed'),
    //           style: 'cancel',
    //         },
    //       ],
    //       {cancelable: false},
    //     );
    //   }
    // }
  }, []);

  useEffect(() => {
    onRequestingPremission();
  }, [onRequestingPremission]);

  useEffect(() => {
    console.log(
      ' timeout appStateActivity.match(/background/)',
      stateUserActivity.pushNotifications,
    );

    if (appStateActivity.match(/background/) && sentPushNotification) {
      console.log('ciclada en appStateActivity');
      let timer: ReturnType<typeof setTimeout> = setTimeout(() => {
        console.log('triggered timer');
        onDisplayNotification();
        clearTimeout(timer);
      }, timeForNextPush);
    }
  }, [appStateActivity, sentPushNotification, timeForNextPush]);

  const appState = useRef(AppState.currentState);

  function getRandomNumber(min: number, max: number): number {
    const time = Math.floor(Math.random() * (max - min + 1)) + min;
    return time * 1000;
  }

  const onFetchingUserActivity = useCallback(
    async ({appState, sentPush}: {appState: string; sentPush: boolean}) => {
      const randomNumber = getRandomNumber(5, 10);

      console.log('randomNumber', randomNumber);
      if (sentPush !== sentPushNotification) {
        console.log('dispatchUserActivityData');

        dispatchUserActivityData({
          type: UserActivityKind.PUSH_NOTIFICATION_PROCESS,
          payload: {
            ...stateUserActivity,
            pushNotifications: {
              appStateActivity: appState,
              sentPushNotification: sentPush,
              timeForNextPush: randomNumber,
            },
          },
        });
      }
    },
    [
      dispatchUserActivityData,
      getRandomNumber,
      sentPushNotification,
      stateUserActivity,
    ],
  );

  // useEffect(() => {
  notifee.onBackgroundEvent(async ({type, detail}) => {
    console.log('onBackgroundEvent', type, detail);
    if (type === EventType.PRESS) {
      console.log('User pressed the notification.', detail.pressAction?.id);
    }
  });

  notifee.registerForegroundService(notification => {
    return new Promise(() => {
      notifee.onForegroundEvent(async ({type, detail}) => {
        if (
          type === EventType.ACTION_PRESS &&
          detail.pressAction?.id === 'stop'
        ) {
          await notifee.stopForegroundService();
        }
      });
    });
  });

  // }, []);

  // useEffect(() => {
  //   const subscription = AppState.addEventListener('change', nextAppState => {
  //     if (
  //       stateUserActivity.pushNotifications.appStateActivity === 'active' &&
  //       nextAppState.match(/background/)
  //     ) {
  //       console.log('hablame', stateUserActivity);
  //       // onDisplayNotification();
  //       // }
  //       console.log(
  //         'App has come to the background!',
  //         stateUserActivity.pushNotifications.appStateActivity,
  //         'background',
  //       );
  //       onFetchingUserActivity({
  //         appState: 'background',
  //         sentPush: true,
  //       });
  //     } else if (
  //       nextAppState === 'active' &&
  //       stateUserActivity.pushNotifications.appStateActivity.match(/background/)
  //     ) {
  //       onFetchingUserActivity({
  //         appState: 'active',
  //         sentPush: false,
  //       });

  //       console.log('App has come to the foreground!');
  //     }
  //     // if(background)

  //     appState.current = nextAppState;
  //     // setAppStateVisible(appState.current);
  //     console.log(
  //       'AppState',
  //       appState.current,
  //       stateUserActivity.pushNotifications,
  //     );
  //   });

  //   return () => {
  //     subscription.remove();
  //   };
  // }, [onFetchingUserActivity]);

  // const appState = useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // if (
      //   appState.current.match(/inactive|background/) &&
      //   nextAppState === 'active'
      // ) {
      //   console.log('App has come to the foreground!');
      //   // onFetchingUserActivity({
      //   //   appState: 'background',
      //   //   sentPush: true,
      //   // });
      // }

      if (nextAppState === 'background') {
        console.log('App has come to the background???', nextAppState);
        console.log(
          'AppState background???',
          stateUserActivity.pushNotifications.appStateActivity,
        );

        if (stateUserActivity.pushNotifications.appStateActivity === '') {
          console.log(
            'Setting first interaction',
            stateUserActivity.pushNotifications.appStateActivity,
          );
          dispatchUserActivityData({
            type: UserActivityKind.PUSH_NOTIFICATION_PROCESS,
            payload: {
              ...stateUserActivity,
              pushNotifications: {
                appStateActivity: 'active',
                sentPushNotification: false,
                timeForNextPush: 5000,
              },
            },
          });
        } else if (
          nextAppState === 'background' &&
          stateUserActivity.pushNotifications.appStateActivity === 'active'
        ) {
          onFetchingUserActivity({
            appState: 'background',
            sentPush: true,
          });
        }
      } else if (nextAppState === 'active') {
        onFetchingUserActivity({
          appState: 'active',
          sentPush: false,
        });
      }
    });

    // appState.current = nextAppState;
    // setAppStateVisible(appState.current);
    // console.log('AppState', appState.current);

    return () => {
      subscription.remove();
    };
  }, [dispatchUserActivityData, onFetchingUserActivity, stateUserActivity]);

  return (
    <>
      {children}

      <Modal
        animationType="slide"
        transparent={true}
        style={{backgroundColor: 'transparent'}}
        visible={modalVisible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalClose}>
              <Icon
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
                name="times"
                size={30}
                color={'#000'}
              />
            </View>
            <Text style={styles.modalTextTitle}>
              {RECONSIDER_PUSH_NOTIFICATIONS_PERMISSION_TITLE}
            </Text>
            <Text style={styles.modalTextBody}>
              {RECONSIDER_PUSH_NOTIFICATIONS_PERMISSION}
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
                Linking.openSettings();
              }}>
              <Text style={styles.textStyle}>{CONTINUE}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default PushNotificationsHandler;

import React, {
  useEffect,
  useContext,
  useCallback,
  useRef,
  useState,
} from 'react';
import {View, AppState, Platform, Modal, Text, Pressable} from 'react-native';
import {useNews} from '../../../hooks';
import {
  NewsContext,
  UserActivityContext,
  UserActivityKind,
} from '../../../stores/entities';
import {constants} from '../../../constants';
import {useNavigation} from '@react-navigation/native';
import {HackerNewsFeedStack} from '../../../navigationContainer/navigationStack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AuthorizationStatus,
  EventType,
  TimestampTrigger,
  TriggerType,
  IntervalTrigger,
  TimeUnit,
  AndroidNotificationSetting,
} from '@notifee/react-native';
import {Linking} from 'react-native';
import styles from './PushNotificationsHandler.styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Timer from 'react-native-background-timer-android';

type HackerNewsFeedNavigationProp =
  NativeStackNavigationProp<HackerNewsFeedStack>;

const IS_IOS = Platform.OS === 'ios';
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
  }, []);

  useEffect(() => {
    onRequestingPremission();
  }, [onRequestingPremission]);

  // async function onCreateTriggerNotification() {
  //   console.log('new Date(Date.now());', new Date(Date.now()));
  //   const date = new Date(Date.now());
  //   date.setHours(0);
  //   date.setMinutes(0);
  //   date.setSeconds(15);

  //   // Create a time-based trigger
  //   const trigger: TimestampTrigger = {
  //     type: TriggerType.TIMESTAMP,
  //     timestamp: date.getTime(), // fire at 11:10am (10 minutes before meeting)
  //   };

  //   // const trigger: IntervalTrigger = {
  //   //   type: TriggerType.INTERVAL,
  //   //   interval: 10,
  //   //   timeUnit: TimeUnit.SECONDS,
  //   // };

  //   // Create a trigger notification

  //   console.log('envie push');

  //   await notifee.createTriggerNotification(
  //     {
  //       title: 'Meeting with Jane',
  //       body: 'Today at 11:20am',
  //       android: {
  //         channelId: 'your-channel-id',
  //       },
  //     },
  //     trigger,
  //   );
  // }

  useEffect(() => {
    console.log(' timeout appStateActivity.match(/background/)', {
      appStateActivity,
      sentPushNotification,
      timeForNextPush,
    });

    if (appStateActivity.match(/background/) && sentPushNotification) {
      // onCreateTriggerNotification();

      if (!IS_IOS) {
        // Start a timer that will log "tic" after 500 milliseconds just once
        // const timeoutId =
        Timer.setTimeout(() => {
          console.log('triggered timer Android');

          return onDisplayNotification();
        }, timeForNextPush);
        // Timer.clearTimeout(timeoutId);
      } else {
        // Cancel the timer if needed
        // console.log('ciclada en appStateActivity');
        let timer: ReturnType<typeof setTimeout> = setTimeout(() => {
          console.log('triggered timer');
          onDisplayNotification();
          clearTimeout(timer);
        }, timeForNextPush);
      }
    }
  }, [appStateActivity, sentPushNotification, timeForNextPush]);

  const getRandomNumber = useCallback((min: number, max: number): number => {
    const time = Math.floor(Math.random() * (max - min + 1)) + min;
    return time * 1000;
  }, []);

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
  // notifee.onBackgroundEvent(async ({type, detail}) => {
  //   console.log('onBackgroundEvent', type, detail);
  //   if (type === EventType.PRESS) {
  //     console.log('User pressed the notification.', detail.pressAction?.id);
  //   }
  // });

  // notifee.registerForegroundService(notification => {
  //   return new Promise(() => {
  //     notifee.onForegroundEvent(async ({type, detail}) => {
  //       if (
  //         type === EventType.ACTION_PRESS &&
  //         detail.pressAction?.id === 'stop'
  //       ) {
  //         await notifee.stopForegroundService();
  //       }
  //     });
  //   });
  // });

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
        visible={modalVisible}
        onRequestClose={() => {
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

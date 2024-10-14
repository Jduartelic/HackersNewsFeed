import React, {useEffect, useContext, useCallback} from 'react';
import {View, AppState, Platform, Modal, Text, Pressable} from 'react-native';
import {
  NewsContext,
  UserActivityContext,
  UserActivityKind,
  NewsKind,
} from '../../../stores/entities';
import {constants} from '../../../constants';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import {Linking} from 'react-native';
import styles from './PushNotificationsHandler.styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Timer from 'react-native-background-timer-android';

const PushNotificationsHandler = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
  const IS_IOS = Platform.OS === 'ios';
  const [modalVisible, setModalVisible] = React.useState(false);
  const {ONBOARDING, USER_ACTIVITY} = constants;
  const {
    RECONSIDER_PUSH_NOTIFICATIONS_PERMISSION,
    RECONSIDER_PUSH_NOTIFICATIONS_PERMISSION_TITLE,
    TITLE_PUSH_NOTIFICATIONS,
    FACETS,
  } = USER_ACTIVITY;
  const {CONTINUE} = ONBOARDING;
  const {dispatchNewsData, stateNewsData} = useContext(NewsContext);
  const {dispatchUserActivityData, stateUserActivityData} =
    useContext(UserActivityContext);
  const {state} = stateNewsData;
  const {state: stateUserActivity} = stateUserActivityData;
  const {appStateActivity, sentPushNotification, timeForNextPush} =
    stateUserActivity.pushNotifications;

  const getRandomNumber = useCallback((min: number, max: number): number => {
    const time = Math.floor(Math.random() * (max - min + 1)) + min;
    return time * 1000;
  }, []);

  const getRandomId = useCallback((min: number, max: number): number => {
    const val = Math.floor(Math.random() * (max - min + 1)) + min;
    return val;
  }, []);

  const onDisplayNotification = useCallback(async () => {
    const {storyTitle, highlightResult} =
      stateNewsData.state.newsList.data[
        getRandomId(0, stateNewsData.state.newsList.data.length - 1)
      ];
    const titlePush =
      TITLE_PUSH_NOTIFICATIONS[
        getRandomId(0, TITLE_PUSH_NOTIFICATIONS.length - 1)
      ];
    const keyword = highlightResult?.commentText?.matchedWords?.find(item =>
      String(item),
    );

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title: titlePush,
      body: storyTitle,
      data: {keywords: keyword ?? ''},
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
      },
    });
  }, [
    TITLE_PUSH_NOTIFICATIONS,
    getRandomId,
    stateNewsData.state.newsList.data,
  ]);

  const onRequestingPremission = useCallback(async () => {
    const settings = await notifee.requestPermission();
    if (Platform.OS === 'ios') {
      if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
        setModalVisible(true);
      }
    }
  }, []);

  useEffect(() => {
    onRequestingPremission();
  }, [onRequestingPremission]);

  useEffect(() => {
    if (appStateActivity.match(/background/) && sentPushNotification) {
      if (!IS_IOS) {
        Timer.setTimeout(() => {
          return onDisplayNotification();
        }, timeForNextPush);
      } else {
        let timer: ReturnType<typeof setTimeout> = setTimeout(() => {
          onDisplayNotification();
          clearTimeout(timer);
        }, timeForNextPush);
      }
    }
  }, [
    appStateActivity,
    sentPushNotification,
    timeForNextPush,
    IS_IOS,
    onDisplayNotification,
  ]);

  const onFetchingUserActivity = useCallback(
    async ({appState, sentPush}: {appState: string; sentPush: boolean}) => {
      const randomNumber = getRandomNumber(30, 60);

      if (sentPush !== sentPushNotification && appState === 'background') {
        const idKeyword = getRandomId(0, 5);
        const facetKeyword = Object.values(FACETS.keywords).find(
          (_, index) => index === idKeyword,
        ) ?? ['Android'];
        const queryParam =
          facetKeyword[getRandomId(0, facetKeyword.length - 1)];

        [getRandomId(0, TITLE_PUSH_NOTIFICATIONS.length - 1)];
        dispatchUserActivityData({
          type: UserActivityKind.PUSH_NOTIFICATION_PROCESS,
          payload: {
            ...stateUserActivity,
            querySearch: queryParam,
            pushNotifications: {
              appStateActivity: appState,
              sentPushNotification: sentPush,
              timeForNextPush: randomNumber,
            },
          },
        });

        dispatchNewsData({
          type: NewsKind.FETCHING,
          payload: {
            ...state,
          },
        });
      }
    },
    [
      dispatchUserActivityData,
      getRandomNumber,
      sentPushNotification,
      stateUserActivity,
      FACETS.keywords,
      TITLE_PUSH_NOTIFICATIONS.length,
      dispatchNewsData,
      getRandomId,
      state,
    ],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'background') {
        if (stateUserActivity.pushNotifications.appStateActivity === '') {
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
        testID="modal-request-permission"
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
                testID="button-close-modal"
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
              testID="button-settings"
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

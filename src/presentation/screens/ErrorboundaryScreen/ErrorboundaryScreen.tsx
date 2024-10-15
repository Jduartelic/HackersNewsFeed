import React, {useContext, useCallback} from 'react';
import {SafeAreaView, Pressable, StatusBar, Text, View} from 'react-native';
import {NewsContext, NewsKind} from '../../stores/entities';
import styles from './ErrorboundaryScreen.styles';
import {constants} from '../../constants';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {HackerNewsFeedStack} from '../../navigationContainer/navigationStack';

type Props = NativeStackScreenProps<HackerNewsFeedStack, 'ErrorboundaryScreen'>;

const ErrorboundaryScreen = ({navigation}: Props): React.JSX.Element => {
  const {ERROR, ONBOARDING} = constants;
  const {stateNewsData, dispatchNewsData} = useContext(NewsContext);
  const {error, state} = stateNewsData;
  const errorType =
    error?.message === 'Network Error'
      ? ERROR.ERR_NETWORK
      : ERROR.GENERIC_ERROR;

  const onCloseModal = useCallback(async () => {
    navigation.goBack();
  }, []);

  return (
    <SafeAreaView
      testID="cementery-news-container"
      style={styles.mainContainer}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={styles.mainContainer.backgroundColor}
      />
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalClose}>
            <Icon
              testID="button-icon-close-modal"
              onPress={onCloseModal}
              name="times"
              size={30}
              color={'#000'}
            />
          </View>
          <Text style={styles.modalTextTitle}>{errorType.TITLE}</Text>
          <Text style={styles.modalTextBody}>{errorType.DESCRIPTION}</Text>
          <Pressable
            testID="button-close-modal"
            style={[styles.button, styles.buttonClose]}
            onPress={onCloseModal}>
            <Text style={styles.textStyle}>{ONBOARDING.CONTINUE}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ErrorboundaryScreen;

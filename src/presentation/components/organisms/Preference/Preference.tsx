import React, {useContext} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Text,
  useWindowDimensions,
} from 'react-native';
import {UserActivityContext, UserActivityKind} from '../../../stores/entities';
import styles from './Preference.styles';
import {constants} from '../../../constants';
import uuid from 'react-native-uuid';
import Icon from 'react-native-vector-icons/FontAwesome5';

const OnboardingScreen = (): React.JSX.Element => {
  const {ONBOARDING, USER_ACTIVITY} = constants;
  const {SELECT_INTEREST_FACETS, PREFERENCE} = ONBOARDING;
  const {keywords} = USER_ACTIVITY.FACETS;
  const {dispatchUserActivityData, stateUserActivityData} =
    useContext(UserActivityContext);
  const {facetsSelectedByUser} = stateUserActivityData.state;

  const renderItem = (keywords: string[], title: string) => {
    return (
      <View
        key={uuid.v4().toString()}
        style={{
          flex: 1,
          width: '100%',
          flexDirection: 'column',
          paddingHorizontal: 16,
          paddingTop: 16,
        }}>
        <Text
          style={{
            fontWeight: '400',
            fontSize: 18,
            color: '#000',
          }}>
          {title}
        </Text>

        {keywords.map(keyword => {
          const isSelected = facetsSelectedByUser?.some(
            facet => facet === keyword,
          );
          return (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 32,
              }}>
              <Text
                style={{
                  fontWeight: '400',
                  fontSize: 14,
                  color: '#000',
                }}>
                {keyword}
              </Text>
              <Icon
                onPress={() => {
                  const {facetsSelectedByUser, facets, userName} =
                    stateUserActivityData.state;
                  const facetsData = facetsSelectedByUser;
                  if (!isSelected) {
                    facetsData?.push(keyword);
                  } else {
                    const index = facetsData?.findIndex(item =>
                      item.includes(keyword),
                    );

                    if (index) {
                      facetsData?.splice(index, 1);
                    }
                  }

                  dispatchUserActivityData({
                    type: UserActivityKind.FETCHED,
                    payload: {
                      ...stateUserActivityData.state,
                      facets: facets,
                      facetsSelectedByUser: facetsData,
                      hasSeenOnboarding: true,
                      querySearch: [],
                      userName: userName,
                    },
                  });
                }}
                name={isSelected ? 'check-square' : 'square'}
                size={30}
                color={isSelected ? 'green' : '#D3D3D3'}
              />
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />

      <View style={{paddingHorizontal: 16}}>
        <Text
          style={{
            fontWeight: '600',
            fontSize: 20,
            color: '#000',
          }}>
          {SELECT_INTEREST_FACETS}
        </Text>
      </View>

      <View
        style={{
          paddingHorizontal: 16,
          // borderBottomColor: '#000',
          // borderBottomWidth: 1,
        }}>
        <Text
          style={{
            fontWeight: '400',
            fontSize: 20,
            color: '#000',
          }}>
          {PREFERENCE}
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.values(keywords).map((item, index) => {
          const title = Object.keys(keywords)[index];
          return renderItem(item, title);
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

import React, {useContext} from 'react';
import {SafeAreaView, ScrollView, StatusBar, View, Text} from 'react-native';
import {UserActivityContext, UserActivityKind} from '../../../stores/entities';
import styles from './Preference.styles';
import {constants} from '../../../constants';
import uuid from 'react-native-uuid';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Preference = (): React.JSX.Element => {
  const {MAIN_COLOR, ONBOARDING, USER_ACTIVITY} = constants;
  const {SELECT_INTEREST_FACETS, PREFERENCE} = ONBOARDING;
  const {keywords: KEY_WORDS} = USER_ACTIVITY.FACETS;
  const {dispatchUserActivityData, stateUserActivityData} =
    useContext(UserActivityContext);
  const {facetsSelectedByUser, facets, userName} = stateUserActivityData.state;

  const renderItem = (
    keywords: string[],
    title: string,
    indexTitleFacet: number,
  ) => {
    return (
      <View
        testID={`preferences-container-${indexTitleFacet}`}
        key={uuid.v4().toString()}
        style={styles.mainContainerFacets}>
        <Text style={styles.textTitleFacet}>{title}</Text>

        {keywords.map((keyword, indexKeyword) => {
          const isSelected = facetsSelectedByUser?.some(
            facet => facet === keyword,
          );
          return (
            <View
              key={uuid.v4().toString()}
              style={styles.innerContainerFacets}>
              <Text style={styles.keywordText}>{keyword}</Text>
              <Icon
                testID={`pressable-component-${indexKeyword}`}
                onPress={() => {
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
                      querySearch: '',
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
      <StatusBar barStyle={'dark-content'} backgroundColor={MAIN_COLOR} />
      <View style={styles.paddingContainer}>
        <Text style={styles.textFacetsInterest}>{SELECT_INTEREST_FACETS}</Text>
      </View>
      <View style={styles.paddingContainer}>
        <Text style={styles.textFacetsPreferences}>{PREFERENCE}</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.values(KEY_WORDS).map((item, index) => {
          const title = Object.keys(KEY_WORDS)[index];
          return renderItem(item, title, index);
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Preference;

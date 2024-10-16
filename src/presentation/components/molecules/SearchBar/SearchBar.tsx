import React, {useContext} from 'react';
import {View, TextInput} from 'react-native';
import {UserActivityContext, UserActivityKind} from '../../../stores/entities';
import styles from './SearchBar.styles';

const SearchBar = () => {
  const {stateUserActivityData, dispatchUserActivityData} =
    useContext(UserActivityContext);
  const {state} = stateUserActivityData;
  const {querySearch} = state;

  const onChangeTextHandler = (passwordInput: string) => {
    dispatchUserActivityData({
      type: UserActivityKind.SAVE_INPUT,
      payload: {
        ...state,
        querySearch: passwordInput,
      },
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        testID="search-bar-input"
        style={styles.input}
        placeholder="Search something cute..."
        value={querySearch}
        onChangeText={onChangeTextHandler}
        placeholderTextColor="#aaa"
      />
    </View>
  );
};

export default SearchBar;

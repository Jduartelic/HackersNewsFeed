import React, {useContext} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {UserActivityContext, UserActivityKind} from '../../../stores/entities';

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
        style={styles.input}
        placeholder="Search something cute..."
        value={querySearch}
        onChangeText={onChangeTextHandler}
        placeholderTextColor="#aaa"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  input: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default SearchBar;

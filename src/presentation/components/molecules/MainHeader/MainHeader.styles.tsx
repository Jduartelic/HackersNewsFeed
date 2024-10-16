import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  mainInnerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 70,
  },
  drawerIconContainer: {
    flexGrow: 0.05,
    flexDirection: 'row',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
  },
  imageContainer: {
    flex: 0.95,
    flexDirection: 'column',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 100,
  },
  containerSearchBarIcon: {
    flexGrow: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default styles;

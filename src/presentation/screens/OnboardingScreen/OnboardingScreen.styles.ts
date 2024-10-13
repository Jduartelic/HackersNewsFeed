import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    // paddingHorizontal: 16,
  },
  scrollViewSkeleton: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTabBarContainer: {
    backgroundColor: '#4682B4',
    padding: 8,
    borderRadius: 24,
  },
  titleButton: {
    fontWeight: '600',
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
  containerPadding: {padding: 16},
});
export default styles;

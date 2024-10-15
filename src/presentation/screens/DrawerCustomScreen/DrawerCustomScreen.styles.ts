import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewSkeleton: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainerLogo: {
    flex: 0.2,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  innerContainerFacets: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  keywordText: {
    fontWeight: '400',
    fontSize: 14,
    color: '#000',
  },
  paddingContainer: {paddingHorizontal: 16, paddingTop: 16},
  textFacetsInterest: {
    fontWeight: '600',
    fontSize: 20,
    color: '#000',
  },
  textFacetsInterestDisabled: {
    fontWeight: '600',
    fontSize: 20,
    color: '#00000066',
  },
  textFacetsPreferences: {
    fontWeight: '400',
    fontSize: 20,
    color: '#000',
  },
  textTitleFacet: {
    fontWeight: '400',
    fontSize: 18,
    color: '#000',
  },
  imageContainer: {height: 70, width: 70, borderRadius: 100},
});
export default styles;

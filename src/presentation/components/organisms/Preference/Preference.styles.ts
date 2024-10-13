import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewSkeleton: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainerFacets: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
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
  paddingContainer: {paddingHorizontal: 16},
  textFacetsInterest: {
    fontWeight: '600',
    fontSize: 20,
    color: '#000',
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
});
export default styles;

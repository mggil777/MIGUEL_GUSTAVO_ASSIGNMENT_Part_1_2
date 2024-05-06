import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {useSearchInfoContext} from '../../contexts/SearchContext';
import InfiniteScrollingFlatList from '../../components/InfiniteScrollingFlatList';
import SearchArtwork from '../../components/SearchArtwork';

const SearchArtScreen = () => {
  const {searchInfo} = useSearchInfoContext();

  return (
    <View style={styles.infiniteScrollingTileContainer}>
      <SearchArtwork />
      <InfiniteScrollingFlatList searchTerm={searchInfo.searchTerm} />
    </View>
  );
};

export default SearchArtScreen;

const styles = StyleSheet.create({
  rootSearchArtScreenElement: {
    width: Dimensions.get('window').width,
    flex: 1,
    padding: 10,
    marginBottom: 60,
    flexDirection: 'column',
  },
  infiniteScrollingTileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  infiniteScroll: {
    width: '100%',
    flex: 1,
    marginTop: 0,
  },
});

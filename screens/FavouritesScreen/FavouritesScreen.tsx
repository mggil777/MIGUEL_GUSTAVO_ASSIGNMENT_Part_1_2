import {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Colors from '../../constants/GlobalColors';
import GlobalStyles from '../../constants/GlobalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InfiniteScrollingFlatList from '../../components/InfiniteScrollingFlatList';

const FavouritesScreen = () => {
  const [savedList, setSavedList] = useState<number[] | undefined>(undefined);
  const objectFilename = 'savedArtworks.json'; // todo: i have a decent amount of viariables which could be placed into some GlobalConstants.tsx file

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const file = await AsyncStorage.getItem(objectFilename);
        if (!file) {
          // create file if it doesn't exist
          await AsyncStorage.setItem(objectFilename, JSON.stringify([]));
        } else {
          const data = JSON.parse(file) as number[];
          setSavedList(data);
          console.log('saved data:', data);
        }
      } catch (err) {
        console.log('error loading data:', err);
      }
    };

    loadSavedData();
  }, []);

  const pageLimit = Math.floor((savedList?.length || 0) / 10) + 1;

  if (!savedList) {
    return <View />;
  }

  if (savedList.length == 0) {
    return (
      <View style={{flex: 1}}>
        <Text style={styles.noArtBookmarked}>No Art Bookmarked Yet</Text>
      </View>
    );
  }

  return (
    <InfiniteScrollingFlatList
      overrideSourceIdList={savedList}
      pageLimit={pageLimit}
      firstPageOverride={
        <View style={styles.infiniteTileContainer}>
          <View style={styles.FavouritesRoot}>
            <Text style={[styles.favouritesHeader, GlobalStyles.headerFont]}>
              Bookmarked
            </Text>
          </View>
        </View>
      }
    />
  );
};

export default FavouritesScreen;

const styles = StyleSheet.create({
  FavouritesRoot: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  infiniteTileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 0,
  },
  favouritesHeader: {
    textAlign: 'left',
    fontSize: 34,
    marginTop: 43,
    paddingLeft: 14,
    color: Colors.primaryAccent,
    backgroundColor: Colors.primaryElement,
  },
  noArtBookmarked: {
    fontSize: 48,
    flex: 1,
    alignSelf: 'center',
    marginTop: 48,
  },
});

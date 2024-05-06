import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Colors from '../../constants/GlobalColors';
import HighLigths from './components/HighLights';
import InfiniteScrollingFlatList from '../../components/InfiniteScrollingFlatList';

const HomeScreen = () => {
  return (
    <InfiniteScrollingFlatList
      startingPage={2}
      firstPageOverride={
        <View style={styles.infiniteTileContainer}>
          <HighLigths />
        </View>
      }
    />
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  rootHomeElement: {
    width: Dimensions.get('window').width,
    flex: 1,
    flexDirection: 'column',
    //marginTop: 36,
    //backgroundColor: Colors.primaryElement,
    //color: Colors.primaryBackground,
  },
  infiniteTileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    //marginBottom: 5,
  },
});

import React from 'react';
import {StyleSheet, SafeAreaView, ActivityIndicator} from 'react-native';
import Animated, {SlideInDown, SlideInUp} from 'react-native-reanimated';

import SearchBar from './components/SearchArtwork';
import ViewSelector from './components/FooterPressable';

import Colors from './constants/GlobalColors';
import {useFonts} from 'expo-font';
import ScreenManager from './components/ScreenControl';

import {ContextProvider} from './contexts/ContextProvider';

export default function App() {
  // import custom fonts
  const [fontsLoaded] = useFonts({
    'Freeman-Regular': require('./assets/fonts/Freeman-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color={Colors.primaryAccent} />;
  }

  return (
    <SafeAreaView style={styles.viewRoot} testID="App-component">
      <ContextProvider>
        <ScreenManager />
        <ViewSelector />
      </ContextProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  viewRoot: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    color: Colors.primaryElement,
  },
});

import React, {useEffect} from 'react';
import {StyleSheet, Pressable} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import GlobalStyles from '../constants/GlobalStyles';
import Colors from '../constants/GlobalColors';
import FooterPressableModes from '../constants/FooterPressableModes';
import {useCurrentModeContext} from '../contexts/PresentModeContext';
import Animated, {FadeInUp, Easing} from 'react-native-reanimated';

const FooterPressable = () => {
  const {currentMode, setCurrentMode} = useCurrentModeContext();

  useEffect(() => {}, [currentMode]);

  let modeToColor = (modeIndex: number) => {
    return currentMode == modeIndex
      ? Colors.primaryElement
      : Colors.minorElement;
  };
  let modeToSize = (modeIndex: number) => {
    return currentMode == modeIndex ? 32 : 26;
  };

  return (
    <Animated.View
      entering={FadeInUp.duration(500).easing(Easing.ease)}
      style={styles.viewRoot}>
      <Pressable
        onPress={() => {
          setCurrentMode(FooterPressableModes.home);
        }}
        style={[styles.modeSelector, GlobalStyles.mediumBorders]}>
        <MaterialIcons
          name="home"
          size={modeToSize(FooterPressableModes.home)}
          color={modeToColor(FooterPressableModes.home)}
        />
      </Pressable>
      <Pressable
        onPress={() => {
          setCurrentMode(FooterPressableModes.search);
        }}
        style={[styles.modeSelector, GlobalStyles.mediumBorders]}>
        <MaterialIcons
          name="search"
          size={modeToSize(FooterPressableModes.search)}
          color={modeToColor(FooterPressableModes.search)}
        />
      </Pressable>
      <Pressable
        onPress={() => {
          setCurrentMode(FooterPressableModes.favourites);
        }}
        style={[styles.modeSelector, GlobalStyles.mediumBorders]}>
        <MaterialIcons
          name="star"
          size={modeToSize(FooterPressableModes.favourites)}
          color={modeToColor(FooterPressableModes.favourites)}
        />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  viewRoot: {
    position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    bottom: 0,
    height: 65,
    width: '100%',
    backgroundColor: Colors.primaryBackground,
  },
  modeSelector: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FooterPressable;

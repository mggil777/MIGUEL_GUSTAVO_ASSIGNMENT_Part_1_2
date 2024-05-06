import React from 'react';
import ScreenViews from '../constants/FooterPressableModes';
import {useCurrentModeContext} from '../contexts/PresentModeContext';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import FavouritesScreen from '../screens/FavouritesScreen/FavouritesScreen';
import SearchArtScreen from '../screens/SearchArtScreen/SearchArtScreen';
import ArtDetailsScreen from '../screens/ArtDetailsScreen/ArtDetailsScreen';

const ScreenControl = () => {
  const {currentMode, setCurrentMode} = useCurrentModeContext();

  const screenTranslationTable = new Map([
    [ScreenViews.home, <HomeScreen />],
    [ScreenViews.search, <SearchArtScreen />],
    [ScreenViews.favourites, <FavouritesScreen />],
    [ScreenViews.details, <ArtDetailsScreen />],
  ]);

  if (!screenTranslationTable.has(currentMode)) {
    new Promise(() => setCurrentMode(ScreenViews.home));
    return screenTranslationTable.get(ScreenViews.home);
  }

  return screenTranslationTable.get(currentMode);
};

export default ScreenControl;

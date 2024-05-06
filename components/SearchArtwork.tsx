import React, {useState} from 'react';
import {View, StyleSheet, TextInput, Switch, Text} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import GlobalStyles from '../constants/GlobalStyles';
import Colors from '../constants/GlobalColors';
import {useCurrentModeContext} from '../contexts/PresentModeContext';
import ScreenViews from '../constants/FooterPressableModes';
import {useSearchInfoContext} from '../contexts/SearchContext';

const SearchArtwork = () => {
  const {currentMode, setCurrentMode} = useCurrentModeContext();
  const [isEnabledPublic, setIsEnabledPublic] = useState(false);
  const [isEnabledView, setIsEnabledView] = useState(false);
  const [inputTextPublic, setInputTextPublic] = useState('');

  const toggleSwitchPublic = () => {
    setIsEnabledPublic(previousState => !previousState);
    triggerShowSearchView(inputTextPublic, !isEnabledPublic, isEnabledView);
    setCurrentMode(ScreenViews.search);

    if (inputTextPublic.length <= 1) {
      setCurrentMode(ScreenViews.search);
    }
  };
  const toggleSwitchView = () => {
    setIsEnabledView(previousState => !previousState);
    triggerShowSearchView(inputTextPublic, isEnabledPublic, !isEnabledView);
    setCurrentMode(ScreenViews.search);
    if (inputTextPublic.length <= 1) {
      setCurrentMode(ScreenViews.search);
    }
  };
  const {
    searchInfo,
    setSearchInfo,
    setNewQuery,
    setIsEnabledP_Public,
    setIsEnabledV_View,
    isEnabledP_Public,
    isEnabledV_View,
  } = useSearchInfoContext();

  const triggerShowSearchView = (
    text: string,
    isEnabledPublic: boolean,
    isEnabledView: boolean,
  ) => {
    if (inputTextPublic.length <= 1) {
      setCurrentMode(ScreenViews.search);
    }

    if (currentMode != ScreenViews.search) {
      setSearchInfo({
        searchTerm: text,
        previousView: currentMode,
        previousViewProps: null,
        isEnabledP_Public: isEnabledPublic,
        isEnabledV_View: isEnabledView,
      });
      setCurrentMode(ScreenViews.search);
    } else {
      setInputTextPublic(text);
      setNewQuery(text);
      setIsEnabledP_Public(isEnabledPublic);
      setIsEnabledV_View(isEnabledView);
    }
  };

  return (
    <View style={styles.searchArtworkRoot}>
      <View style={styles.searchArtworkContainer}>
        <View style={[styles.searchArtwork, GlobalStyles.noBorders]}>
          <TextInput
            placeholder="Search Artworks"
            placeholderTextColor={Colors.primaryAccent}
            style={styles.searchArtworkInputField}
            onChangeText={newText =>
              triggerShowSearchView(newText, isEnabledPublic, isEnabledView)
            }
          />
        </View>
        <MaterialIcons
          name="search"
          size={24}
          color={Colors.primaryAccent}
          style={styles.searchArtworkIcon}
        />
        <View style={styles.togglePublic}>
          <Switch
            trackColor={{false: '#767577', true: '#98FB98'}}
            thumbColor={isEnabledPublic ? '#20B2AA' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitchPublic}
            value={isEnabledPublic}
          />
        </View>
        <Text style={[styles.togglePublicText, GlobalStyles.headerFont]}>
          Public Domain
        </Text>
        <View style={styles.toggleDisplay}>
          <Switch
            trackColor={{false: '#767577', true: '#98FB98'}}
            thumbColor={isEnabledView ? '#20B2AA' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitchView}
            value={isEnabledView}
          />
        </View>
        <Text style={[styles.toggleDisplayText, GlobalStyles.headerFont]}>
          On View
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchArtworkRoot: {
    marginTop: 36,
    height: 85,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primaryElement,
  },
  searchArtworkContainer: {
    width: '100%',
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,

    alignItems: 'center',
    backgroundColor: Colors.primaryElement,
  },
  searchArtwork: {
    flex: 1,
    marginLeft: 10,
    height: 45,
    paddingLeft: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 2,
  },
  searchArtworkInputField: {
    flex: 1,
    marginLeft: 20,
    borderColor: Colors.primaryAccent,
    color: Colors.primaryAccent,
  },
  searchArtworkIcon: {
    position: 'absolute',
    marginLeft: 15,
  },
  icon: {
    height: 45,
    width: 45,
    left: 0,
  },
  togglesContainer: {
    width: '100%',
    height: 35,
    position: 'absolute',
  },
  togglePublic: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 110,
  },
  togglePublicText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.primaryAccent,
    position: 'absolute',
    top: 40,
    right: 85,
  },

  toggleDisplay: {
    top: 0,
    right: 15,
  },
  toggleDisplayText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.primaryAccent,
    position: 'absolute',
    top: 40,
    right: 15,
  },
});

export default SearchArtwork;

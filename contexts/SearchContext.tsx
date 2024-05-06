import React, {useState, createContext, useContext} from 'react';
import ViewModes from '../constants/FooterPressableModes';
import {useCurrentModeContext} from './PresentModeContext';

type SearchInfoProps = {
  searchTerm?: string;
  previousView: ViewModes;
  previousViewProps?: any;
  isEnabledP_Public?: boolean;
  isEnabledV_View?: boolean;
};

interface SearchInfoContextProps {
  searchInfo: SearchInfoProps;
  setSearchInfo: (newMode: SearchInfoProps) => void;
  setNewQuery: (newQuery: string) => void;
  setIsEnabledP_Public: (isEnabledP_Public: boolean) => void;
  setIsEnabledV_View: (isEnabledV_View: boolean) => void;
  isEnabledP_Public: boolean;
  isEnabledV_View: boolean;
}

export const SearchInfoContext = createContext<
  SearchInfoContextProps | undefined
>(undefined);

export const useSearchInfoContext = () => {
  let context = useContext(SearchInfoContext);
  if (!context) {
    throw new Error("Used SearchInfoContext outside of it's provider");
  } else {
    return context;
  }
};

export const SearchInfoProvider = ({children}: any) => {
  const [searchInfo, setSearchInfoInternal] = useState({} as SearchInfoProps);
  const {currentMode, setCurrentMode} = useCurrentModeContext();
  const [isEnabledP_Public, setIsEnabledPInternal] = useState(false);
  const [isEnabledV_View, setIsEnabledVInternal] = useState(false);

  const setSearchInfo = (newInfo: SearchInfoProps) => {
    setSearchInfoInternal(oldInfo => ({...oldInfo, ...newInfo}));
  };

  const setNewQuery = (searchTerm: string) => {
    setSearchInfoInternal(prevSearchInfo => {
      const newQuery = {...prevSearchInfo};
      if (searchTerm === '') {
        setCurrentMode(prevSearchInfo.previousView);
        return {} as SearchInfoProps;
      } else {
        newQuery.searchTerm = searchTerm;
        return newQuery;
      }
    });
  };

  const setIsEnabledP_Public = (isEnabledP_Public: boolean) => {
    setIsEnabledPInternal(isEnabledP_Public);
  };

  const setIsEnabledV_View = (isEnabledV_View: boolean) => {
    setIsEnabledVInternal(isEnabledV_View);
  };

  const contextValues: SearchInfoContextProps = {
    searchInfo,
    setSearchInfo,
    setNewQuery,
    setIsEnabledP_Public,
    setIsEnabledV_View,
    isEnabledP_Public,
    isEnabledV_View,
  };
  return (
    <SearchInfoContext.Provider value={contextValues}>
      {children}
    </SearchInfoContext.Provider>
  );
};

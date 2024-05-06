import React, {useState, createContext, useContext} from 'react';
import ScreenViews from '../constants/FooterPressableModes';

interface CurrentModeContextProps {
  currentMode: number;
  setCurrentMode: (newMode: number) => void;
}

export const CurrentModeContext = createContext<
  CurrentModeContextProps | undefined
>(undefined);

export const useCurrentModeContext = () => {
  let context = useContext(CurrentModeContext);
  if (!context) {
    throw new Error("Used CurrentModeContext outside of it's provider");
  } else {
    return context;
  }
};

export const CurrentModeProvider = ({children}: any) => {
  const [currentMode, setCurrentModeInternal] = useState(ScreenViews.home);
  const setCurrentMode = (newMode: number) => {
    setCurrentModeInternal(newMode);
  };

  const contextValues: CurrentModeContextProps = {
    currentMode,
    setCurrentMode,
  };

  return (
    <CurrentModeContext.Provider value={contextValues}>
      {children}
    </CurrentModeContext.Provider>
  );
};

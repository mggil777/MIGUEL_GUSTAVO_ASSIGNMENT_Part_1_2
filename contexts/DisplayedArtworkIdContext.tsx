import React, {createContext, useContext, useState} from 'react';

interface DisplayedArtDataContextProps {
  artId: number | null;
  setArtId: (newArtId: number) => void;
}

const DisplayedArtworkIdContext = createContext<
  DisplayedArtDataContextProps | undefined
>(undefined);

export const useDisplayedArtworkIdContext = () => {
  let context = useContext(DisplayedArtworkIdContext);
  if (!context) {
    throw new Error("Used DisplayedArtworkIdContext outside of it's provider");
  } else {
    return context;
  }
};

export const DisplayedArtIdProvider = ({children}: any) => {
  const [artId, setArtDataInternal] = useState<number | null>(null);
  const setArtId = (newArtId: number) => {
    setArtDataInternal(newArtId);
  };

  const contextValues: DisplayedArtDataContextProps = {
    artId,
    setArtId,
  };

  return (
    <DisplayedArtworkIdContext.Provider value={contextValues}>
      {children}
    </DisplayedArtworkIdContext.Provider>
  );
};

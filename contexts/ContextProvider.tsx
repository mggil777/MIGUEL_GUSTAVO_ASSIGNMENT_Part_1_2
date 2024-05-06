import React from 'react';
import {SearchInfoProvider} from './SearchContext';
import {CurrentModeProvider} from './PresentModeContext';
import {DisplayedArtIdProvider} from './DisplayedArtworkIdContext';

export const ContextProvider = ({children}: any) => {
  return (
    <CurrentModeProvider>
      <SearchInfoProvider>
        <DisplayedArtIdProvider>{children}</DisplayedArtIdProvider>
      </SearchInfoProvider>
    </CurrentModeProvider>
  );
};

import React, { createContext, useState, useContext } from 'react';

const IdeaSpaceContext = createContext();

export const IdeaSpaceProvider = ({ children }) => {
  const [selectedIdeaSpaceId, setSelectedIdeaSpaceId] = useState(null);

  return (
    <IdeaSpaceContext.Provider value={{ selectedIdeaSpaceId, setSelectedIdeaSpaceId }}>
      {children}
    </IdeaSpaceContext.Provider>
  );
};

export const useIdeaSpace = () => useContext(IdeaSpaceContext);
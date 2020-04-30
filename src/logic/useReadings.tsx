// Hook (use-auth.js)
import React, { useState, useEffect, useContext, createContext } from 'react';
import DummyDataGenerator from './DummyDataGenerator';

const readingContext = createContext<any>(null);

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideReading({ children }: any) {
  const readings = useProvideReading();
  return (
    <readingContext.Provider value={readings}>
      {children}
    </readingContext.Provider>
  );
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useReading = () => {
  return useContext(readingContext);
};

// Provider hook that creates auth object and handles state
function useProvideReading() {
  const [reading, setReading] = useState<any>(null);
  const dummyGenerator = DummyDataGenerator(setReading);

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    dummyGenerator.startGenerating();

    // Cleanup subscription on unmount
    return () => dummyGenerator.stopGenerating();
  }, [dummyGenerator]);

  // Return the user object and auth methods
  return {
    reading,
  };
}

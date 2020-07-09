// Hook (use-auth.js)
import React, { useState, useEffect, useContext, createContext } from 'react';
import DummyDataGenerator from './DummyDataGenerator';
import SerialDataHandler from './SerialDataHandler';
import InitialReading from '../constants/InitialReading';
import DataConfig from '../constants/DataConfig';
import { log } from './AppLogger';

const readingContext = createContext<any>(null);

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideReading({ children }: any) {
  const reading = useProvideReading();
  return (
    <readingContext.Provider value={reading}>
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
  const [reading, setReading] = useState(InitialReading);
  // const dummyGenerator = DummyDataGenerator(setReading, DataConfig.dataFrequency);

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    log.info('Starting SerialDataHandler');
    SerialDataHandler.startUsbListener(setReading);
    // console.log('starting generator');
    // dummyGenerator.startGenerating();
    // Cleanup subscription on unmount
    return () => {
      SerialDataHandler.stopUsbListener();
    };
    // return () => dummyGenerator.stopGenerating();
    // }, []);
  }, []);
  // },[]);
  // Return the user object and auth methods
  return {
    values: reading,
  };
}

// Hook (use-auth.js)
import React, { useState, useEffect, useContext, createContext } from 'react';
import DummyDataGenerator from './DummyDataGenerator';
// import SerialDataHandler from './SerialDataHandler';
import Constants from '../constants/Constants';
import dummyDataGenerator from './DummyDataGenerator';

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
  const [reading, setReading] = useState({
    peep: 5,
    peakPressure: 25,
    // patientRate: getRandomValue(220),
    plateauPressure: 20,
    patientRate: 10,
    vte: 400,
    inspiratoryTime: 3,
    expiratoryTime: 5,
    oxygen: 21,
    flow: 23,
    graphPressure: new Array(Constants.GraphLength).fill(40),
    graphVolume: new Array(Constants.GraphLength).fill(200),
    graphFlow: new Array(Constants.GraphLength).fill(150),
  });
  const dummyGenerator = DummyDataGenerator(setReading, 10);
  // const serialDataHandler = SerialDataHandler({ baudRate: 115200 }, setReading);

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    // serialDataHandler.startUsbListener();
    console.log('starting generator');
    dummyGenerator.startGenerating();
    // Cleanup subscription on unmount
    // return () => {
    //   async function stopUSBListener() {
    //     await serialDataHandler.stopUsbListener();
    //   }
    // };
    return () => dummyGenerator.stopGenerating();
  }, []);
  //[serialDataHandler.state.connected]);

  // Return the user object and auth methods
  return {
    values: reading,
  };
}

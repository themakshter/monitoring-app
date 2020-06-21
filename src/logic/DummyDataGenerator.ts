import SerialDataRetriever from '../interfaces/SerialDataRetriever';

export default function dummyDataGenerator(
  onNewPacket: (value: any) => void,
  dataFrequency: number,
): SerialDataRetriever {
  let intervalFunction: number;
  const intervalFrequency = 1000 / dataFrequency;
  let data: string = '';
  let counter = 0;

  function generateDummyReadings() {
    let dataPacket = new Array(49);
    if (counter < data.length) {
      for (let i = 0; i < 49; i++) {
        dataPacket[i] = data.substring(counter, counter + 1).charCodeAt(0);
        counter++;
      }
      onNewPacket(dataPacket);
    }
  }

  function startGenerating() {
    console.log('starting dummy generator');
    var RNFS = require('react-native-fs');
    RNFS.readFileAssets('sample_data.txt', 'ascii').then((result: any) => {
      data = result;
    });
    intervalFunction = setInterval(() => {
      generateDummyReadings();
    }, intervalFrequency);
  }

  function stopGenerating() {
    clearInterval(intervalFunction);
  }

  return {
    start: startGenerating,
    stop: stopGenerating,
  };
}

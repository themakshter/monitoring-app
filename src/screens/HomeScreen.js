import * as React from 'react';
import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import PeepPressure from '../components/PeepPressure.js';
import Graphs from '../components/Graphs';
import MetricDisplay from '../components/MetricDisplay';
import AlarmMetricDisplay from '../components/AlarmMetricDisplay';
import { useReading } from '../logic/useReading';

export default function HomeScreen(props) {
  const reading = useReading();
  const readingValues = reading.values;
  const [PeakPress, setPeakPressure] = useState(10);
  const [GraphPressure, setGraphPressure] = useState(new Array(2000).fill(0));
  const [GraphVolume, setGraphVolume] = useState(new Array(2000).fill(0));
  const [PatientRate, setPatientRate] = useState(0);
  const [ITime, setITime] = useState('1.0');
  const [VTe, setVTe] = useState(0);
  const [IERatio, setIERatio] = useState('1:2.0');
  const [Oxygen, setOxygen] = useState(21);
  const [PlateauPressure, setPlateauPressure] = useState(21);
  const [Peep, setPeep] = useState(5);



  return (
    <View style={styles.container}>
      <View style={styles.peakpressure}>
        <PeepPressure PeakPressure={PeakPress} Peep={Peep}></PeepPressure>
      </View>
      <View style={styles.valuesandgraphs}>
        <View style={styles.configuredvalues}>
          <AlarmMetricDisplay
            style={styles.configuredvaluedisplay}
            title={'Patient Rate'}
            value={readingValues.patientRate}
            unit={'BPM'}
            lowerLimit={20}
            upperLimit={150}></AlarmMetricDisplay>
          <MetricDisplay
            style={styles.configuredvaluedisplay}
            title={'Plateau Press.'}
            value={PlateauPressure}
            unit={''}></MetricDisplay>
          <MetricDisplay
            style={styles.configuredvaluedisplay}
            title={'VTe'}
            value={VTe}
            unit={'ml'}></MetricDisplay>
          <MetricDisplay
            style={styles.configuredvaluedisplay}
            title={'I-Time'}
            value={ITime}
            unit={'sec'}></MetricDisplay>
          <MetricDisplay
            style={styles.configuredvaluedisplay}
            title={'I:E Ratio'}
            value={IERatio}
            unit={''}></MetricDisplay>
          <MetricDisplay
            style={styles.configuredvaluedisplay}
            title={'Oxygen'}
            value={Oxygen}
            unit={''}></MetricDisplay>
        </View>
        <View style={styles.graphs}>
          <View style={{ height: '50%', paddingTop: 5, paddingBottom: 0 }}>
            <Graphs
              data={GraphPressure}
              yMin={-100}
              yMax={100}
              numberOfTicks={4}></Graphs>
          </View>
          <View style={{ height: '50%', paddingTop: 0, paddingBottom: 0 }}>
            <Graphs
              data={GraphVolume}
              yMin={-10}
              yMax={30}
              numberOfTicks={4}
              // style={{ maxheight: "50%" }}
            ></Graphs>
          </View>
        </View>
      </View>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#fff',
    padding: 2,
  },
  peakpressure: {
    flex: 1,
    height: '100%',
    backgroundColor: '#fff',
    flexDirection: 'column',
    borderWidth: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderColor: 'grey',
  },
  valuesandgraphs: {
    flex: 5,
    height: '100%',
    backgroundColor: 'white',
    padding: 2,
  },
  configuredvalues: {
    borderWidth: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderColor: 'grey',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 2,

    // width: "100%",
  },
  configuredvaluedisplay: {
    flex: 0.2,
  },
  graphs: {
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'space-around',
    borderWidth: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderColor: 'grey',
    height: '100%',
    // justifyContent: "space-around",
    // flexGrow: 1,
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});

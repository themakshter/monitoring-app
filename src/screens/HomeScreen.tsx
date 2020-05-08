import * as React from 'react';
import { useState } from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import PeepPressure from '../components/PeepPressure';
import Graphs from '../components/Graphs';
import MetricDisplay from '../components/MetricDisplay';
import AlarmMetricDisplay from '../components/AlarmMetricDisplay';
import { useReading } from '../logic/useReading';
import { MetricDisplayString } from '../components/MetricDisplay';
import initalVentilatorConfiguration from '../constants/InitialVentilatorConfiguration';
import SetParameter from 'src/interfaces/SetParameter';

// import { Colors } from 'react-native/Libraries/NewAppScreen';
import Colors from '../constants/Colors';
export default function HomeScreen(props: any) {
  const reading = useReading();
  const readingValues = reading.values;
  // const [PeakPress, setPeakPressure] = useState(10);
  // const [GraphPressure, setGraphPressure] = useState(new Array(2000).fill(0));
  // const [GraphVolume, setGraphVolume] = useState(new Array(2000).fill(0));
  // const [PatientRate, setPatientRate] = useState(0);
  // const [ITime, setITime] = useState('1.0');
  // const [VTe, setVTe] = useState(0);
  // const [IERatio, setIERatio] = useState('1:2.0');
  // const [Oxygen, setOxygen] = useState(21);
  // const [PlateauPressure, setPlateauPressure] = useState(21);
  const [Peep, setPeep] = useState(5);
  const ventilatorConfig = initalVentilatorConfiguration;
  const patientRate: SetParameter = ventilatorConfig.respiratoryRate;

  // console.log('homescreen');
  return (
    <View style={styles.container}>
      <View style={styles.peakpressure}>
        <PeepPressure
          PeakPressure={readingValues.peakPressure}
          Peep={readingValues.peep}
          Pip={readingValues.PIP}></PeepPressure>
      </View>
      {/* <View style={styles.valuesandgraphs}> */}
      <View style={styles.graphs}>
        <Text style={styles.graphTitle}>Pressure [cmH20]</Text>
        <View style={{ flex: 1, paddingTop: 0, paddingBottom: 0 }}>
          <Graphs
            data={readingValues.graphPressure}
            yMin={-30}
            yMax={60}
            numberOfTicks={4}
            fillColor={Colors.graphPressure}
            strokeColor={Colors.graphPressureStrokeColor}></Graphs>
        </View>
        <Text style={styles.graphTitle}>Tidal Volume [ml]</Text>
        <View style={{ flex: 1, paddingTop: 0, paddingBottom: 0 }}>
          <Graphs
            data={readingValues.graphVolume}
            yMin={0}
            yMax={800}
            numberOfTicks={4}
            fillColor={Colors.graphVolume}
            strokeColor={Colors.graphVolumeStrokeColor}
            // style={{ maxheight: "50%" }}
          ></Graphs>
        </View>
        <Text style={styles.graphTitle}>Flow Rate [lpm]</Text>
        <View style={{ flex: 1, paddingTop: 0, paddingBottom: 0 }}>
          <Graphs
            data={readingValues.graphFlow}
            yMin={-100}
            yMax={100}
            numberOfTicks={4}
            fillColor={Colors.graphFlow}
            strokeColor={Colors.graphFlowStrokeColor}
            // style={{ maxheight: "50%" }}
          ></Graphs>
        </View>
      </View>
      <View style={styles.configuredvalues}>
        <MetricDisplay
          style={styles.configuredvaluedisplay}
          title={'FiO2'}
          value={readingValues.oxygen}
          unit={'%'}></MetricDisplay>
        <MetricDisplay
          style={styles.configuredvaluedisplay}
          title={'Patient Rate'}
          value={readingValues.patientRate}
          unit={'BPM'}></MetricDisplay>
        <MetricDisplay
          style={styles.configuredvaluedisplay}
          title={'Tidal Vol'}
          value={readingValues.tidalVolume}
          unit={'ml'}></MetricDisplay>
        <MetricDisplay
          style={styles.configuredvaluedisplay}
          title={'Plateau Press.'}
          value={readingValues.plateauPressure}
          unit={''}></MetricDisplay>

        <MetricDisplayString
          style={styles.configuredvaluedisplay}
          title={'I:E Ratio'}
          value={readingValues.ieRatio}
          unit={''}></MetricDisplayString>

        <MetricDisplay
          style={styles.configuredvaluedisplay}
          title={'VTi'}
          value={readingValues.vti}
          unit={'ml'}></MetricDisplay>
        <MetricDisplay
          style={styles.configuredvaluedisplay}
          title={'VTe'}
          value={readingValues.vte}
          unit={'ml'}></MetricDisplay>
        <MetricDisplay
          style={styles.configuredvaluedisplay}
          title={'Minute Vent'}
          value={readingValues.minuteVentilation}
          unit={'slm'}></MetricDisplay>
        <MetricDisplayString
          style={styles.configuredvaluedisplay}
          title={'Mode'}
          value={readingValues.mode}
          unit={''}></MetricDisplayString>
      </View>
      {/* </View> */}
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
    backgroundColor: Colors.GeneralBackGround,
    padding: 2,
  },
  peakpressure: {
    flex: 1,
    height: '100%',
    backgroundColor: Colors.GeneralBackGround,
    flexDirection: 'column',
    borderWidth: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderColor: Colors.Borders,
    margin: 1,
  },
  valuesandgraphs: {
    flex: 10,
    // height: '100%',
    backgroundColor: Colors.GeneralBackGround,
    // padding: 2,
    flexDirection: 'row',
  },
  configuredvalues: {
    borderWidth: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderColor: Colors.Borders,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    margin: 1,
    height: '100%',
    // width: "100%",
  },
  configuredvaluedisplay: {
    flex: 0.2,
  },
  graphTitle: {
    color: Colors.TextColor,
    textAlign: 'center',
  },
  graphs: {
    flex: 8,
    flexDirection: 'column',
    justifyContent: 'space-around',
    borderWidth: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderColor: Colors.Borders,
    height: '100%',
    margin: 1,
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

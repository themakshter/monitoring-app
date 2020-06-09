import * as React from 'react';
import { useState } from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import PressureDisplay from '../components/PressureDisplay';
import Graphs from '../components/Graphs';
import MetricDisplay from '../components/MetricDisplay';
import AlarmMetricDisplay from '../components/AlarmMetricDisplay';
import { useReading } from '../logic/useReading';
import { MetricDisplayString } from '../components/MetricDisplay';
import initalVentilatorConfiguration from '../constants/InitialVentilatorConfiguration';
import SetParameter from 'src/interfaces/SetParameter';
import Colors from '../constants/Colors';
import TidalVolumeMetricDisplay from '../components/TidalVolumeMetricDisplay';

export default function HomeScreen(props: any) {
  const reading = useReading();
  const readingValues = reading.values;
  const ventilatorConfig = initalVentilatorConfiguration;

  return (
    <View style={styles.container}>
      <View style={styles.pressureDisplay}>
        <PressureDisplay
          measuredPressure={readingValues.measuredPressure}
          peep={readingValues.peep}
          pip={readingValues.pip}
          plateauPressure={readingValues.plateauPressure}></PressureDisplay>
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
            yMin={-250}
            yMax={600}
            numberOfTicks={4}
            fillColor={Colors.graphVolume}
            strokeColor={Colors.graphVolumeStrokeColor}
          ></Graphs>
        </View>
        <Text style={styles.graphTitle}>Flow Rate [lpm]</Text>
        <View style={{ flex: 1, paddingTop: 0, paddingBottom: 0 }}>
          <Graphs
            data={readingValues.graphFlow}
            yMin={-110}
            yMax={100}
            numberOfTicks={4}
            fillColor={Colors.graphFlow}
            strokeColor={Colors.graphFlowStrokeColor}
            markers={readingValues.breathMarkers}
          ></Graphs>
        </View>
      </View>
      <View style={styles.configuredvalues}>
        <MetricDisplayString
          style={styles.configuredvaluedisplay}
          title={readingValues.fiO2.name}
          value={readingValues.fiO2.value}
          unit={readingValues.fiO2.unit}></MetricDisplayString>
        <MetricDisplay
          style={styles.configuredvaluedisplay}
          title={readingValues.respiratoryRate.name}
          value={readingValues.respiratoryRate.value}
          unit={readingValues.respiratoryRate.unit}></MetricDisplay>
        <MetricDisplayString
          style={styles.configuredvaluedisplay}
          title={'I:E Ratio'}
          value={readingValues.ieRatio}
          unit={''}></MetricDisplayString>
        <TidalVolumeMetricDisplay
          style={styles.configuredvaluedisplay}
          parameter={readingValues.tidalVolume}
          ventilationMode={readingValues.mode}
        />
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
          title={readingValues.minuteVentilation.name}
          value={readingValues.minuteVentilation.value}
          unit={readingValues.minuteVentilation.unit}></MetricDisplay>
        <MetricDisplayString
          style={styles.configuredvaluedisplay}
          title={'Ventilation Mode'}
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
    backgroundColor: Colors.generalBackGround,
    padding: 2,
  },
  pressureDisplay: {
    flex: 1,
    height: '100%',
    backgroundColor: Colors.generalBackGround,
    flexDirection: 'column',
    borderWidth: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderColor: Colors.borders,
    margin: 1,
  },
  valuesandgraphs: {
    flex: 10,
    // height: '100%',
    backgroundColor: Colors.generalBackGround,
    // padding: 2,
    flexDirection: 'row',
  },
  configuredvalues: {
    borderWidth: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderColor: Colors.borders,
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
    color: Colors.textColor,
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
    borderColor: Colors.borders,
    height: '100%',
    margin: 1,
    // justifyContent: "space-around",
    // flexGrow: 1,
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
});

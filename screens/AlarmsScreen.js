import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import OptionButton from '../components/OptionButton';
import DetailedAlarmMetricDisplay from '../components/DetailedAlarmMetricDisplay';
import Layout from '../constants/Layout';

export default function AlarmsScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <OptionButton icon="md-school" label="Read the Parameters" />
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: Layout.window.width,
          justifyContent: 'space-evenly',
        }}>
        <DetailedAlarmMetricDisplay
          title={'Patient Rate'}
          value={0}
          unit={'BPM'}
          lowerLimit={30}
          upperLimit={50}
        />
        <DetailedAlarmMetricDisplay
          title={'Patient Rate'}
          value={80}
          unit={'BPM'}
          lowerLimit={30}
          upperLimit={50}
        />
        <DetailedAlarmMetricDisplay
          title={'Patient Rate'}
          value={40}
          unit={'BPM'}
          lowerLimit={30}
          upperLimit={50}
        />
        <DetailedAlarmMetricDisplay
          title={'Patient Rate'}
          value={40}
          unit={'BPM'}
          lowerLimit={30}
          upperLimit={50}
        />
        <DetailedAlarmMetricDisplay
          title={'Patient Rate'}
          value={40}
          unit={'BPM'}
          lowerLimit={30}
          upperLimit={50}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    paddingTop: 15,
  },
});

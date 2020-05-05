import * as React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import DetailedAlarmMetricDisplay from '../components/DetailedAlarmMetricDisplay';
import { convertArrayToMatrix } from '../utils/helpers';
import { alarmsMetrics } from '../../sample-data/data';
import { Parameter } from '../Interfaces/Parameter';

export default function AlarmsScreen() {
  const metrics = convertArrayToMatrix<Parameter>(alarmsMetrics, 4);

  return (
    <View style={styles.gaugeContainer}>
      <ScrollView>
        {metrics.map((row) => {
          return (
            <View style={styles.gaugeRow}>
              {row.map((metricToDisplay) => {
                return (
                  <DetailedAlarmMetricDisplay
                    title={metricToDisplay.title}
                    value={metricToDisplay.value}
                    unit={metricToDisplay.unit}
                    lowerLimit={metricToDisplay.lowerLimit}
                    upperLimit={metricToDisplay.upperLimit}
                  />
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  gaugeRow: {
    flexDirection: 'row',
    flex: 1,
    borderColor: '#CEC3C0',
    borderWidth: 1,
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '95%',
    justifyContent: 'space-around',
  },
  gaugeContainer: {
    marginBottom: 15,
    width: '100%',
  },
});

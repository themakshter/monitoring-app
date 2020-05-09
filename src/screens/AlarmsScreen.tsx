import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import DetailedAlarmMetricDisplay from '../components/DetailedAlarmMetricDisplay';
import { convertArrayToMatrix } from '../utils/helpers';
import { Row } from '../components/Globals/Row';
import initalVentilatorConfiguration from '../constants/InitialVentilatorConfiguration';
import SetParameter from 'src/interfaces/SetParameter';

export default function AlarmsScreen() {
  const [metrics, setMetrics] = useState<SetParameter[][] | null>(null);

  useEffect(() => {
    const setParameters: SetParameter[] = Object.values(
      initalVentilatorConfiguration,
    ).filter((item: SetParameter) => item.name !== undefined);

    setMetrics(() => {
      return convertArrayToMatrix<SetParameter>(setParameters, 4);
    });
  }, []);

  return (
    <View style={styles.gaugeContainer}>
      <ScrollView
        style={{
          flexGrow: 1,
        }}>
        {metrics &&
          metrics?.map((row, index) => {
            return (
              <Row key={row[index]?.name || ''}>
                {row.map((metricToDisplay) => {
                  console.log(metricToDisplay);
                  // check if type is SetParameter
                  if (metricToDisplay.name) {
                    return (
                      <DetailedAlarmMetricDisplay
                        key={metricToDisplay.name}
                        metric={metricToDisplay}
                      />
                    );
                  }
                  return null;
                })}
              </Row>
            );
          })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  gaugeContainer: {
    marginBottom: 15,
    marginTop: 15,
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
  },
});

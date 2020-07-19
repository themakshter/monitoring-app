import { default as React, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import VentSwitch from '../components/VentSwitch';
import ConfigSelect from '../components/ConfigSelect';
import configs from '../constants/Configurables';
import ToggleUpdate from '../components/UpdateButton';
import initialVentilatorConfiguration from '../constants/InitialVentilatorConfiguration';

export default function LinksScreen() {
  const [canUpdate, setCanUpdate] = useState(false);
  const [ventConfigs, setVentConfigs] = useState({
    ...initialVentilatorConfiguration,
  });
  const [isVentilating, setIsVentilating] = useState(false);

  const handleState = (key: string, value: string | boolean) => {
    setVentConfigs((prevState: any) => ({
      ...prevState,
      [key]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <ToggleUpdate canUpdate={canUpdate} setCanUpdate={setCanUpdate} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {Object.keys(configs).map((config) => (
          <ConfigSelect
            key={config}
            configKey={config}
            label={configs[config].label}
            selectedValue={ventConfigs[config]}
            isEditable={canUpdate}
            settingsHandler={handleState}
            unit={configs[config].unit}
            pickerItems={configs[config].options}
          />
        ))}
      </ScrollView>
      <VentSwitch
        switchHandler={setIsVentilating}
        isVentilating={isVentilating}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.generalBackGround,
  },
  contentContainer: {
    paddingTop: 15,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import { ProvideReading } from './logic/useReadings';

const Stack = createStackNavigator();

export default function App(props) {
  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
      <ProvideReading>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Main"
              component={BottomTabNavigator}
              initialParams={[34, 45]}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ProvideReading>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

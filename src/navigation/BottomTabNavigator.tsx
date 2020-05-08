import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { Image, View, Text } from 'react-native';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/ConfigurationScreen';
import AlarmsScreen from '../screens/AlarmsScreen';
// import { Colors } from 'react-native/Libraries/NewAppScreen';
import Colors from '../constants/Colors';
const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Main';

function LogoTitle(props: any) {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require('../img/openventpk.png')}></Image>
  );
}
export default function BottomTabNavigator({
  navigation,
  route,
  initialParams,
}) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({
    headerTitle: getHeaderTitle(route),
    // headerTitle: <LogoTitle></LogoTitle>,
    headerTintColor: Colors.TextColor,
    headerStyle: {
      backgroundColor: Colors.GeneralBackGround,
    },
  });
  console.log(JSON.stringify(route));
  return (
    <BottomTab.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      tabBarOptions={{
        activeBackgroundColor: Colors.GeneralBackGround,
        inactiveBackgroundColor: Colors.GeneralBackGround,
        activeTintColor: Colors.ActiveText,
        inactiveTintColor: Colors.InactiveText,
        showLabel: true,
      }}
      screenOptions={{}}>
      <BottomTab.Screen
        name="Main"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-code-working" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Alarms"
        component={AlarmsScreen}
        options={{
          // title: 'Alarms',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-alert" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Configuration"
        component={LinksScreen}
        options={{
          title: 'Configuration',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-settings" />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route: any) {
  const routeName =
    route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Main':
      return 'Main Display';
    case 'Parameters':
      return 'Parameters';
    case 'Alarms':
      return 'Alarms';
    case 'Monitoring':
      return 'Monitoring';
    case 'LungMechanics':
      return 'Lung Mechanics';
    case 'Graphs':
      return 'Graphs';
    case 'Configuration':
      return 'Configuration';
  }
}

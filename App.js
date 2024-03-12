import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash1 from './screens/onboarding/splash1';

import Onboard1 from './screens/onboarding/onboard1';
import Onboard2 from './screens/onboarding/onboard2';
import Onboard3 from './screens/onboarding/onboard3';
import Onboard4 from './screens/onboarding/onboard4';
import Onboard5 from './screens/onboarding/onboard5';
import Onboard6 from './screens/onboarding/onboard6';

import Login from './screens/onboarding/login';

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="Splash1" component={Splash1} />

        <Stack.Screen name="Onboard1" component={Onboard1} />
        <Stack.Screen name="Onboard2" component={Onboard2} />
        <Stack.Screen name="Onboard3" component={Onboard3} />
        <Stack.Screen name="Onboard4" component={Onboard4} />
        <Stack.Screen name="Onboard5" component={Onboard5} />
        <Stack.Screen name="Onboard6" component={Onboard6} />

        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

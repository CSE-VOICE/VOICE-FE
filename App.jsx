import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { GradientBackground } from './components/GradientBackground';
import store from './redux/store';
import AuthStack from './screens/Auth/AuthStack';
import LoadPage from './screens/LoadPage';
import MainTabs from './screens/MainTabs';

LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered']);

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Auth');
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        await Font.loadAsync({
          'LGEIHeadlineTTF': require('./assets/fonts/LG-EI_font_all/TTF/LGEIHeadlineTTF-Bold.ttf'),
        });
        setFontsLoaded(true);

        const token = await AsyncStorage.getItem('userToken');
        // 토큰이 있으면 LoadPage부터 시작
        setInitialRoute(token ? 'LoadPage' : 'Auth');
      } catch (e) {
        console.error('Restoring token failed:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  if (isLoading || !fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
    <GestureHandlerRootView style={{ flex: 1 }}>
    <GradientBackground>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Auth" component={AuthStack} />
          <Stack.Screen 
            name="LoadPage" 
            component={LoadPage}
            options={{ gestureEnabled: false }} 
          />
          <Stack.Screen 
            name="MainTabs" 
            component={MainTabs}
            options={{ gestureEnabled: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </GradientBackground>
    </GestureHandlerRootView>
    </Provider>
  );
}
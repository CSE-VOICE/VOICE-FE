// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import * as Font from 'expo-font';
// import { StatusBar } from 'expo-status-bar';
// import { useEffect, useState } from 'react';
// import { GradientBackground } from './components/GradientBackground';
// import AiPickStack from './screens/AiPick/AiPickStack';
// import ApplianceStack from './screens/Appliance/ApplianceStack';
// import Login from './screens/Auth/Login';
// import SignUp from './screens/Auth/SignUp';
// import LoadPage from './screens/LoadPage';
// import MainPage from './screens/MainPage';
// import MyPageStack from './screens/Mypage/MyPageStack';

// const BottomTab = createBottomTabNavigator();
// const AuthStack = createStackNavigator();

// // Bottom Tab Navigator for main app screens
// function MainTabs() {
//   return (
//     <BottomTab.Navigator
//       screenOptions={{
//         headerShown: false,
//         tabBarStyle: {
//           height: 100,
//           backgroundColor: 'transparent',
//           borderTopWidth: 0,
//           elevation: 0,
//           shadowOpacity: 0,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           fontWeight: '600',
//           marginBottom: 5,
//         },
//         tabBarActiveTintColor: '#5e5eb4',
//         tabBarInactiveTintColor: '#666666',
//       }}
//     >
//       <BottomTab.Screen
//         name="MainPage"
//         component={MainPage}
//         options={{ tabBarLabel: '홈',
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="home-outline" size={24} color={color} />
//           ),
//          }}
//       />
//       <BottomTab.Screen
//         name="Ai's Pick"
//         component={AiPickStack}
//         options={{ tabBarLabel: 'AI 추천',
//           tabBarIcon: ({ color }) => (
//             <MaterialCommunityIcons name="thumb-up-outline" size={24} color={color} />
//           ), }}
//       />
//       <BottomTab.Screen
//         name="가전기기 관리"
//         component={ApplianceStack}
//         options={{ tabBarLabel: '가전관리',
//           tabBarIcon: ({ color }) => (
//             <MaterialCommunityIcons name="view-grid-outline" size={24} color={color} />
//           ), }}
//       />
//       <BottomTab.Screen
//         name="Mypage"
//         component={MyPageStack}
//         options={{ tabBarLabel: '내정보',
//           tabBarIcon: ({ color }) => (
//             <MaterialCommunityIcons name="star-outline" size={24} color={color} />
//           ), }}
//       />
//     </BottomTab.Navigator>
//   );
// }

// // Stack Navigator for authentication and LoadPage
// function AuthFlow() {
//   return (
//     <AuthStack.Navigator screenOptions={{ headerShown: false }}>
//       <AuthStack.Screen name="Login" component={Login} />
//       <AuthStack.Screen name="SignUp" component={SignUp} />
//       <AuthStack.Screen name="LoadPage" component={LoadPage} />
//       <AuthStack.Screen name="MainTabs" component={MainTabs} />
//     </AuthStack.Navigator>
//   );
// }

// export default function App() {
//   const [fontsLoaded, setFontsLoaded] = useState(false);

//   useEffect(() => {
//     const loadFonts = async () => {
//       try {
//         await Font.loadAsync({
//           'LGEIHeadlineTTF': require('./assets/fonts/LG-EI_font_all/TTF/LGEIHeadlineTTF-Bold.ttf'),
//         });
//         setFontsLoaded(true);
//       } catch (error) {
//         console.error('Font loading error:', error);
//         setFontsLoaded(true);
//       }
//     };

//     loadFonts();
//   }, []);

//   if (!fontsLoaded) {
//     return null;
//   }

//   return (
//     <>
//       <GradientBackground>
//         <NavigationContainer>
//           <AuthFlow />
//         </NavigationContainer>
//         <StatusBar style="auto" />
//       </GradientBackground>
//     </>
//   );
// }


// App.jsx
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GradientBackground } from './components/GradientBackground';
import AiPickStack from './screens/AiPick/AiPickStack';
import ApplianceStack from './screens/Appliance/ApplianceStack';
import Login from './screens/Auth/Login';
import SignUp from './screens/Auth/SignUp';
import LoadPage from './screens/LoadPage';
import MainPage from './screens/MainPage';
import MyPageStack from './screens/Mypage/MyPageStack';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 100,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 5,
        },
        tabBarActiveTintColor: '#5e5eb4',
        tabBarInactiveTintColor: '#666666',
      }}
    >
      <BottomTab.Screen
        name="MainPage"
        component={MainPage}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Ai's Pick"
        component={AiPickStack}
        options={{
          tabBarLabel: 'AI 추천',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="thumb-up-outline" size={24} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="가전기기 관리"
        component={ApplianceStack}
        options={{
          tabBarLabel: '가전관리',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="view-grid-outline" size={24} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Mypage"
        component={MyPageStack}
        options={{
          tabBarLabel: '내정보',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="star-outline" size={24} color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

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
  );
}
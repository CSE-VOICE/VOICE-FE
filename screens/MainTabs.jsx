import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AiPickStack from './AiPick/AiPickStack';
import ApplianceStack from './Appliance/ApplianceStack';
import MainPage from './MainPage';
import MyPageStack from './Mypage/MyPageStack';

const BottomTab = createBottomTabNavigator();

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
export default MainTabs;
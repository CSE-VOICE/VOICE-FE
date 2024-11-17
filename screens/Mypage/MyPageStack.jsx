import { createStackNavigator } from '@react-navigation/stack';
import ChangePassword from './ChangePassword';
import MyPage from './MyPage';
import MyPageAI from './MyPageAI';
import MyPageInfo from './MyPageInfo';
import MyPageRoutine from './MyPageRoutine';

const Stack = createStackNavigator();

function MyPageStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name=" " component={MyPage} />
            <Stack.Screen 
                name="MyPageRoutine" 
                component={MyPageRoutine}
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTintColor: '#666666',
                    title: ' '
                }}
            />
            <Stack.Screen 
                name="MyPageAI" 
                component={MyPageAI}
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTintColor: '#666666',
                    title: ' '
                }}
            />
            <Stack.Screen 
                name="MyPageInfo" 
                component={MyPageInfo}
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTintColor: '#666666',
                    title: ' '
                }}
            />
            <Stack.Screen 
                name="ChangePassword" 
                component={ChangePassword}
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTintColor: '#666666',
                    title: ' '
                }}
            />
        </Stack.Navigator>
    );
}

export default MyPageStack;
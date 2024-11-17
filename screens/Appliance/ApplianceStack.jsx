import { createStackNavigator } from '@react-navigation/stack';
import Appliance from './Appliance';
import ApplianceDetail from './ApplianceDetail';

const Stack = createStackNavigator();

function ApplianceStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="ApplianceList" component={Appliance} />
            <Stack.Screen name="ApplianceDetail" component={ApplianceDetail} />
        </Stack.Navigator>
    );
}

export default ApplianceStack;
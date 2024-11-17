// screens/AiPick/AiPickStack.jsx
import { createStackNavigator } from '@react-navigation/stack';
import AiPick from './AiPick';
import Recommendation from './recommendation';

const Stack = createStackNavigator();

function AiPickStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AiPick" component={AiPick} />
      <Stack.Screen name="Recommendation" component={Recommendation} />
    </Stack.Navigator>
  );
}

export default AiPickStack;
import Login from './Login.jsx';
import SignUp from './SignUp.jsx';

function AuthStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    );
}
export default AuthStack;
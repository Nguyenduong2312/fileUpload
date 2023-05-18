import Login from './components/Login';
import Register from './components/Register'
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffff',
    justifyContent: 'center',
  },
});*/

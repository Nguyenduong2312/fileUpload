import Login from './components/Login';
import Profile from './components/Fill';
import Record from './components/MyRecord';
import Register from './components/Register';
import ReceivedRequests from './components/ReceivedRequests';
import Family from './components/Family';
import ViewFam from './components/ViewMemRe';
import Home from './components/Home';
import Received from './components/ReceivedRecord';
import Sent from './components/SentRequests';
import { NavigationContainer } from '@react-navigation/native';
import UserInfo from './components/UserInfo';
import { LogOut } from './components/LogOut';
import RelationshipRequests from './components/RelationRequests';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem label="Log Out" onPress={() => LogOut()} />
        </DrawerContentScrollView>
    );
}
const Drawer = createDrawerNavigator();

function MyDrawer() {
    return (
        <Drawer.Navigator
            useLegacyImplementation
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Edit Profile" component={Profile} />
            <Drawer.Screen name="My Record" component={Record} />
            <Drawer.Screen
                name="Received Requests"
                component={ReceivedRequests}
            />
            <Drawer.Screen name="Received Records" component={Received} />
            <Drawer.Screen name="Sent Requests" component={Sent} />
            <Drawer.Screen
                name="View family member's profiles"
                component={ViewFam}
            />
            <Drawer.Screen name="Add family member" component={Family} />
            <Drawer.Screen
                name="Relationship Requests"
                component={RelationshipRequests}
            />
        </Drawer.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                    name="Home"
                    component={MyDrawer}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="Log Out" component={LogOut} />
                <Stack.Screen name="Family" component={Family} />
                <Stack.Screen name="User Info" component={UserInfo} />
                <Stack.Screen name="User Record" component={Record} />
                <Stack.Screen name="User Relationship" component={ViewFam} />
                <Stack.Screen
                    name="Edit Profile"
                    component={MyDrawer}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Add family member"
                    component={MyDrawer}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="My Record"
                    component={MyDrawer}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Received Records"
                    component={MyDrawer}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Sent Requests"
                    component={MyDrawer}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Received Requests"
                    component={MyDrawer}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name=" View family member's profiles"
                    component={MyDrawer}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Relationship Requests"
                    component={MyDrawer}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

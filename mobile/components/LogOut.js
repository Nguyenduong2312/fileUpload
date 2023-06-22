import { BackHandler, Alert } from 'react-native';
export function LogOut() {
    Alert.alert('Hold on!', 'Are you sure you want to log out?', [
        {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
        },
        { text: 'YES', onPress: () => BackHandler.exitApp() },
    ]);
    return true;
}

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { LogOut } from './LogOut';
const Custom = ({ screenName }) => {
    return (
        <Card style={styles.list}>
            <Text>{screenName}</Text>
        </Card>
    );
};

export default HomeScreen = (props) => {
    return (
        <View>
            <Text style={styles.txt}>Account</Text>
            <TouchableOpacity
                onPress={() => props.navigation.navigate('Edit Profile')}
            >
                <Custom screenName="Edit Profile" />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() =>
                    props.navigation.navigate('Login', {
                        isAuth: true,
                    })
                }
            >
                <Custom screenName="Log Out" />
            </TouchableOpacity>
            <Text style={styles.txt}>List of requests</Text>
            <TouchableOpacity
                onPress={() => props.navigation.navigate('Sent Requests')}
            >
                <Custom screenName="Sent Requests" />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => props.navigation.navigate('Received Requests')}
            >
                <Custom screenName="Download My Record Requests" />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() =>
                    props.navigation.navigate('Relationship Requests')
                }
            >
                <Custom screenName="Set Relationship Requests" />
            </TouchableOpacity>
            <Text style={styles.txt}>Family</Text>
            <TouchableOpacity
                onPress={() => props.navigation.navigate('Add family member')}
            >
                <Custom screenName="Add new member" />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() =>
                    props.navigation.navigate("View family member's profiles")
                }
            >
                <Custom screenName="View family member's profiles" />
            </TouchableOpacity>
            <Text style={styles.txt}>Record</Text>
            <TouchableOpacity
                onPress={() => props.navigation.navigate('My Record')}
            >
                <Custom screenName="My Records" />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => props.navigation.navigate('Received Records')}
            >
                <Custom screenName="Received Records" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    txt: {
        padding: 5,
        fontSize: 15,
    },
    list: {
        marginTop: 0,
        height: 50,
        alignItems: 'center',
        marginBottom: 2,
        width: '100%',

        padding: 15,
    },
});

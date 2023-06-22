import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SyncStorage from 'sync-storage';

import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
export default UserPro = ({ props, route, navigation }) => {
    console.log('route.params', route.params);
    let { id } = route.params || '';
    const [user, setUser] = useState({});
    console.log('id:ps', id);
    useEffect(() => {
        console.log('detail');

        fetch(`http://192.168.1.27:5000/account/${id}`, {
            credentials: 'include',
            method: 'GET',
            headers: {
                authorization: `Bearer ${SyncStorage.get('token')}`,
            },
        })
            .then((res) => res.json())
            .then((account) => {
                console.log('acc', account);
                setUser(account);
            });
    }, [id]);

    const viewRecord = () => {
        console.log('iddd', user.id);
        navigation.navigate('User Record', { id: user.id, isAuth: false });
    };
    const viewRelation = () => {
        navigation.navigate('User Relationship', { id: user.id });
    };

    return (
        <SafeAreaProvider
            style={{
                flex: 1,
                backgroundColor: 'white',
                paddingHorizontal: 22,
            }}
        >
            <ScrollView>
                <View>
                    <Text style={styles.title}>Profile of user {user.id}</Text>
                    <View>
                        <Text>Name</Text>
                        <View style={styles.input}>
                            <Text>{user.name} </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.view}>
                    <View>
                        <Text>Address</Text>
                        <View style={styles.input}>
                            <Text>{user.address} </Text>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'column',
                        marginBottom: 6,
                    }}
                >
                    <View>
                        <Text>Email</Text>
                        <View style={styles.input}>
                            <Text>{user.email} </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.view}>
                    <View>
                        <Text>Birthday</Text>
                        <View style={styles.input}>
                            <Text>{user.date} </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.view}>
                    <View>
                        <Text>Gender</Text>
                        <View style={styles.input}>
                            <Text>{user.gender} </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.centeredView}>
                    <TouchableOpacity style={styles.container}>
                        <Text
                            style={styles.text}
                            onPress={() => viewRelation()}
                        >
                            View user's relationship
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.container}>
                        <Text style={styles.text} onPress={() => viewRecord()}>
                            View user's healthrecord
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 44,
        width: '100%',
        borderColor: 'secondaryGray',
        borderWidth: 1,
        borderRadius: 4,
        marginVertical: 6,
        justifyContent: 'center',
        paddingLeft: 8,
    },

    title: {
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 30,
        color: '#0039a6',
    },
    container: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        marginVertical: 5,
        marginTop: 5,
        marginBottom: 15,
        borderRadius: 5,
        backgroundColor: '#0039a6',
    },
    centeredView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    text: {
        fontWeight: 'bold',
        color: 'white',
    },
    view: {
        flexDirection: 'column',
        marginBottom: 6,
    },
});

import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import SyncStorage from 'sync-storage';

import UserInfo from './UserInfo';

export default function Basic({ props, route, navigation }) {
    const [childList, setChildList] = useState([]);
    const [parentList, setParentList] = useState([]);
    let { id } = route.params || '';

    useEffect(() => {
        setParentList([]);
        setChildList([]);
        fetch(`http://192.168.1.27:5000/account/${id ? 'id/' + id : 'user'}`, {
            credentials: 'include',
            method: 'GET',
            headers: {
                authorization: `Bearer ${SyncStorage.get('token')}`,
            },
        })
            .then((res) => res.json())
            .then((account) => {
                const accRelationship = account.relationship;
                for (let key in accRelationship) {
                    fetch(`http://192.168.1.27:5000/account/id/${key}`, {
                        credentials: 'include',
                        method: 'GET',
                    })
                        .then((res) => res.json())
                        .then((user) => {
                            var tmp = user;
                            tmp.roleRelationShip = accRelationship[key];
                            if (accRelationship[key] !== 'Child') {
                                setParentList((oldArray) => [...oldArray, tmp]);
                            } else {
                                setChildList((oldArray) => [...oldArray, tmp]);
                            }
                        });
                }
            });
    }, []);

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const onRowDidOpen = (rowKey) => {
        console.log('This row opened', rowKey);
    };
    const renderItem = (data) => (
        <TouchableHighlight
            onPress={() => console.log('You touched me')}
            style={styles.rowFront}
            underlayColor={'#AAA'}
        >
            <View>
                <Text style={styles.txt}>ID: {data.item.id}</Text>
                <Text style={styles.txt}>Name: {data.item.name}</Text>
                <Text style={styles.txt}>
                    Role: {data.item.roleRelationShip}
                </Text>
            </View>
        </TouchableHighlight>
    );
    const viewDetails = (data) => {
        const id = data.item.id;
        console.log('ID=', data.item._id);
        <UserInfo />;
        navigation.navigate(`User Info`, {
            id: data.item._id,
        });
    };

    const save = async (uri, filename, mimetype) => {
        if (Platform.OS === 'android') {
            const permissions =
                await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (permissions.granted) {
                const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                await FileSystem.StorageAccessFramework.createFileAsync(
                    permissions.directoryUri,
                    filename,
                    mimetype,
                )
                    .then(async (uri) => {
                        await FileSystem.writeAsStringAsync(uri, base64, {
                            encoding: FileSystem.EncodingType.Base64,
                        });
                    })
                    .catch((e) => console.log(e));
            } else {
                shareAsync(uri);
            }
        } else {
            shareAsync(uri);
        }
    };

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => viewDetails(data, rowMap)}
            >
                <Text style={styles.backTextWhite}>View Details</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Parents</Text>

                <SwipeListView
                    data={parentList}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    leftOpenValue={75}
                    rightOpenValue={-150}
                    previewRowKey={'0'}
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                    onRowDidOpen={onRowDidOpen}
                />
            </View>
            <View>
                <Text style={styles.title}>Children</Text>

                <SwipeListView
                    data={childList}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    leftOpenValue={75}
                    rightOpenValue={-150}
                    previewRowKey={'0'}
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    backTextWhite: {
        color: '#FFF',
    },
    txt: {
        color: '#0039a6',
        fontSize: 15,
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#0039a6',
        justifyContent: 'center',
        height: 80,
    },
    title: {
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 25,
        color: '#0039a6',
    },

    rowBack: {
        alignItems: 'center',

        flex: 1,

        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 155,
    },

    backRightBtnRight: {
        backgroundColor: '#0039a6',
        right: 0,
    },
});

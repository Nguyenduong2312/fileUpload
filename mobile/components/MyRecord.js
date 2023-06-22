import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
} from 'react-native';
import SyncStorage from 'sync-storage';

import { SwipeListView } from 'react-native-swipe-list-view';
import * as FileSystem from 'expo-file-system';
export default function Basic({ route }) {
    ///
    const id = route.id;
    console.log('route', route);
    const [listData, setListData] = useState();
    requestedCheck = true;
    const [userID, setUserID] = useState('');
    if (typeof route.params !== 'undefined') {
        requestedCheck = route.params.isAuth;
    }

    console.log('my record: ', SyncStorage.get('token'));

    useEffect(() => {
        fetch('http://192.168.1.27:5000/account/user', {
            credentials: 'include',
            method: 'GET',
            headers: {
                authorization: `Bearer ${SyncStorage.get('token')}`,
            },
        })
            .then((res) => res.json())
            .then((account) => {
                console.log('user id:', account.id);
                console.log('id:', id);

                setUserID(account.id);
                console.log('sda', id || account.id);
                fetch(`http://192.168.1.27:5000/record/${id || account.id}`, {
                    headers: {
                        authorization: `Bearer ${SyncStorage.get('token')}`,
                    },
                })
                    .then((res) => res.json())
                    .then((records) => {
                        console.log('records', records);
                        setListData(records);
                    })
                    .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
    }, []);

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const renderItem = (data) => (
        <TouchableHighlight style={styles.rowFront} underlayColor={'#AAA'}>
            <View>
                <Text style={styles.txt}>File name: {data.item.fileName}</Text>
                <Text style={styles.txt}>
                    ID Uploader: {data.item.idUploader}
                </Text>
            </View>
        </TouchableHighlight>
    );
    const downloadFromAPI = async (data, rowMap) => {
        const filename = 'download';
        closeRow(rowMap, data.item.key);
        //const localhost = Platform.OS === "android" ? "10.0.2.2" : "127.0.0.1";
        const result = await FileSystem.downloadAsync(
            `http://192.168.1.27:5000/record/download/${data.item._id}`, //fetch
            FileSystem.documentDirectory + data.item.nameRecord,
            {
                headers: {
                    MyHeader: 'MyValue',
                },
            },
        );
        save(result.uri, filename, result.headers['Content-Type']);
    };

    const sendRequest = async (data, rowMap) => {
        console.log('send request', data.item);
        const formData = {
            ['idSender']: userID.toString(),
            ['idReceiver']: data.item.idReceiver,
            ['idRecord']: data.item._id,
            ['idOnChain']: data.item.idOnChain,
            ['nameRecord']: data.item.fileName,
        };
        console.log('formData: ', formData);
        fetch('http://192.168.1.27:5000/requestRecord', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${SyncStorage.get('token')}`,
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                return response.json();
            })
            .then((res) => {
                console.log(res.msg || '');
            })
            .catch((error) => console.log(error));

        closeRow(rowMap, data.item.key);
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
            {requestedCheck === true ? (
                <TouchableOpacity
                    style={[styles.backRightBtn, styles.backRightBtnLeft]}
                    onPress={() => downloadFromAPI(data, rowMap)}
                >
                    <Text style={styles.backTextWhite}>Download</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={[styles.backRightBtn, styles.backRightBtnLeft]}
                    onPress={() => sendRequest(data, rowMap)}
                >
                    <Text style={styles.backTextWhite}>Request</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => closeRow(rowMap, data.item.key)}
            >
                <Text style={styles.backTextWhite}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <SwipeListView
                data={listData}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                leftOpenValue={75}
                rightOpenValue={-150}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
            />
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
        marginTop: 60,
        marginBottom: 40,
        textAlign: 'center',
        fontSize: 35,
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
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: '#03C03C',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
});

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

export default function Basic() {
    const [requestList, setRequestList] = useState();

    console.log('my request: ', SyncStorage.get('token'));

    useEffect(() => {
        fetch(`http://192.168.1.27:5000/account/user`, {
            credentials: 'include',
            method: 'GET',
            headers: {
                authorization: `Bearer ${SyncStorage.get('token')}`,
            },
        })
            .then((res) => res.json())
            .then((account) => {
                console.log('acc', account);
                console.log('id:', account.id);
                fetch(
                    `http://192.168.1.27:5000/requestRecord/receiver/${account.id}`,
                    {
                        headers: {
                            authorization: `Bearer ${SyncStorage.get('token')}`,
                        },
                    },
                )
                    .then((res) => res.json())
                    .then((request) => {
                        console.log('request ', request);
                        setRequestList(request);
                    });
            });
    }, []);

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        const newData = [...listData];
        const prevIndex = listData.findIndex((item) => item.key === rowKey);
        newData.splice(prevIndex, 1);
        setListData(newData);
    };

    const onRowDidOpen = (rowKey) => {
        console.log('This row opened', rowKey);
    };

    const handleAccept = async (data, rowMap) => {
        console.log('ID at now is', data.item._id);
        try {
            fetch(`http://192.168.1.27:5000/requestRecord/${data.item._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idSender: data.item.idSender,
                    status: 'Accepted',
                }),
            });
            //.then(res => res.json())
            //.then(res => {console.log(res);})
            //props.setLengthOfRequestList((prev) => prev - 1);
        } catch (err) {
            console.log('lỗi');
        }
        //deleteRow(rowMap, data.item.key)
    };

    const handleReject = async (data, rowMap) => {
        console.log('ID at now is', data.item._id);
        try {
            fetch(`http://192.168.1.27:5000/requestRecord/${data.item._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idSender: data.item.idSender,
                    status: 'Rejected',
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.status === true) {
                        console.log('xóa thành công');
                    } else {
                        console.log('fail');
                    }
                });
            //props.setLengthOfRequestList((prev) => prev - 1);
        } catch (err) {
            console.log('lỗi');
        }
    };

    const renderItem = (data) => (
        <TouchableHighlight
            onPress={() => console.log('You touched me')}
            style={styles.rowFront}
            underlayColor={'#AAA'}
        >
            <View>
                <Text style={styles.txt}>Sender ID: {data.item.idSender}</Text>
                <Text style={styles.txt}>
                    File name: {data.item.nameRecord}
                </Text>
            </View>
        </TouchableHighlight>
    );

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnLeft]}
                onPress={() => handleAccept(data, rowMap)}
            >
                <Text style={styles.backTextWhite}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => handleReject(data, rowMap)}
            >
                <Text style={styles.backTextWhite}>Reject</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <SwipeListView
                data={requestList}
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
        height: 100,
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
        backgroundColor: '#0039a6',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
});

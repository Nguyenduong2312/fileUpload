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

export default function Basic({ navigation }) {
    const [requestList, setRequestList] = useState();
    const [lengthOfRequestList, setLengthOfRequestList] = useState(0);

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
                fetch(
                    `http://192.168.1.27:5000/membership/receiver/${account.id}`,
                    {
                        credentials: 'include',
                        method: 'GET',
                    },
                )
                    .then((res) => res.json())
                    .then((requests) => {
                        setRequestList(requests);
                        setLengthOfRequestList(requests.length);
                    });
            });
    }, [lengthOfRequestList]);

    console.log('requestList', requestList);

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
        //console.log('This row opened', rowKey);
    };

    const renderItem = (data) => (
        <TouchableHighlight
            onPress={() => console.log('You touched me')}
            style={styles.rowFront}
            underlayColor={'#AAA'}
        >
            <View>
                <Text style={styles.txt}>Sender ID: {data.item.senderId}</Text>
                <Text style={styles.txt}>
                    Role: Your {data.item.senderRole}
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
    const handleAccept = async (data, rowMap) => {
        console.log('ID at now is', data.item._id);
        try {
            fetch(`http://192.168.1.27:5000/membership/${data.item._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data.item),
            })
                .then((res) => res.json())
                .then((res) => {
                    console.log(res.msg);
                })
                .catch((error) => console.log(error));
            //props.setLengthOfRequestList((prev) => prev - 1);
        } catch (err) {
            console.log('lỗi');
        }
        //deleteRow(rowMap, data.item.key)
    };

    const handleReject = async (data, rowMap) => {
        console.log('ID at now is', data.item._id);
        try {
            fetch(`http://192.168.1.27:5000/membership/${data.item._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data.item),
            })
                .then((res) => res.json())
                .then((res) => {
                    console.log(res.msg);
                })
                .catch((error) => console.log(error));
            //props.setLengthOfRequestList((prev) => prev - 1);
        } catch (err) {
            console.log('lỗi');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.swipetext}>
                <Text style={styles.title}>
                    Swipe Right to view sender's profile
                </Text>
                <Text style={styles.title}>
                    Swipe Left to accept/reject requests
                </Text>
            </View>
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
    swipetext: {
        marginBottom: 10,
        alignItems: 'center',
        backgroundColor: '#0039a6',
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

    backMidBtnLeft: {
        backgroundColor: '#0039a6',
        left: 0,
    },
    backRightBtnLeft: {
        backgroundColor: '#03C03C',
        right: 75,
    },
    title: {
        marginBottom: 5,
        color: '#FFF',

        fontSize: 15,
        fontColor: '#0039a6',
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
});

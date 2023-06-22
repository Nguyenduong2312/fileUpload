import { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
} from 'react-native';
import SyncStorage from 'sync-storage';

import { SwipeListView } from 'react-native-swipe-list-view';

export default function Basic() {
    const [requestList, setRequestList] = useState();
    const [length, setLength] = useState(0);
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
                console.log('account.id:', account.id);
                fetch(
                    `http://192.168.1.27:5000/requestRecord/sender/${account.id}`,
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
                        setLength(request.length);
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

    const renderItem = (data) => (
        <TouchableHighlight
            onPress={() => console.log('You touched me')}
            style={styles.rowFront}
            underlayColor={'#AAA'}
        >
            <View>
                <Text style={styles.txt}>
                    Receiver ID: {data.item.idReceiver}
                </Text>
                <Text style={styles.txt}>
                    File name: {data.item.nameRecord}
                </Text>
                {data.item.status == 'Accepted' ? (
                    <Text style={styles.accepted}>{data.item.status}</Text>
                ) : null}
                {data.item.status == 'Rejected' ? (
                    <Text style={styles.rejected}>{data.item.status}</Text>
                ) : null}
                {data.item.status == 'Waiting' ? (
                    <Text style={styles.waitting}>[{data.item.status}]</Text>
                ) : null}
            </View>
        </TouchableHighlight>
    );

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => closeRow(rowMap, data.item.key)}
            >
                <Text style={styles.backTextWhite}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnLeft]}
                onPress={() => handleDelete(data, rowMap)}
            >
                <Text style={styles.backTextWhite}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    const handleDelete = async (data, rowMap) => {
        console.log('ID at now is', data.item._id);
        fetch(`http://192.168.1.27:5000/requestRecord/${data.item._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res.msg);
            })
            .catch((error) => console.log(error));
    };

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
    accepted: {
        color: '#03C03C',
        fontWeight: 'bold',
    },
    waitting: {
        color: '#FFC300',
        fontWeight: 'bold',
    },
    rejected: {
        color: '#FF4433',
        fontWeight: 'bold',
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
        backgroundColor: 'red',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: '#0039a6',

        right: 0,
    },
});

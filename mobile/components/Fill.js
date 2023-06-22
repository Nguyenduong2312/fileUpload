import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SyncStorage from 'sync-storage';
import {
    StyleSheet,
    View,
    TextInput,
    KeyboardAvoidingView,
    Modal,
    Text,
    Platform,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import CustomButton from './CustomButton';
import { getFormatedDate } from 'react-native-modern-datepicker';
import DatePicker from 'react-native-modern-datepicker';
export default LoginScreen = (props) => {
    const { control, handleSubmit } = useForm();
    const [user, setUser] = useState('');
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
                setUser(account);
            });
    }, [user.id]);

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [address, setAddress] = useState(user.address);
    const today = new Date();
    const startDate = getFormatedDate(
        today.setDate(today.getDate() + 1),
        'DD-MM-YYYY',
    );
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState(user.date);
    const [startedDate, setStartedDate] = useState('');
    const [genderOpen, setGenderOpen] = useState(false);
    const [genderValue, setGenderValue] = useState(user.gender);
    const [gender, setGender] = useState([
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
    ]);

    const handleChangeStartDate = (propDate) => {
        setStartedDate(propDate);
    };
    const handleOnPressStartDate = () => {
        setOpenStartDatePicker(!openStartDatePicker);
    };
    const onRegisterPressed = async (e) => {
        let date = selectedStartDate;
        let gender = genderValue;
        const formData = { name, address, email, date, gender };
        try {
            fetch(`http://192.168.1.27:5000/myProfile/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            }).then(() => alert('Information is updated!'));
            //setMessage(res.data);
            //props.navigation.navigate('Home');
        } catch (err) {
            if (err.response.status === 500) {
                alert('There was a problem with the server');
                return;
            }
        }
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
                    <Text style={styles.title}>Edit Your Profile</Text>
                    <View>
                        <View>
                            <Text style={styles.id}>
                                {' '}
                                YOUR ID IS {user.id}{' '}
                            </Text>
                        </View>
                        <Text>Name</Text>
                        <View style={styles.input}>
                            <TextInput
                                value={name === '' ? ' ' : name || user.name}
                                onChangeText={(value) => setName(value)}
                                editable={true}
                            />
                        </View>
                    </View>
                </View>

                <View
                    style={{
                        flexDirection: 'column',
                        marginBottom: 6,
                    }}
                >
                    <Text>Address</Text>
                    <View
                        style={{
                            height: 44,
                            width: '100%',
                            borderColor: 'black',
                            borderWidth: 1,
                            borderRadius: 4,
                            marginVertical: 6,
                            justifyContent: 'center',
                            paddingLeft: 8,
                        }}
                    >
                        <TextInput
                            value={
                                address === '' ? ' ' : address || user.address
                            }
                            onChangeText={(value) => setAddress(value)}
                            editable={true}
                        />
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'column',
                        marginBottom: 6,
                    }}
                >
                    <Text>Email</Text>
                    <View
                        style={{
                            height: 44,
                            width: '100%',
                            borderColor: 'black',
                            borderWidth: 1,
                            borderRadius: 4,
                            marginVertical: 6,
                            justifyContent: 'center',
                            paddingLeft: 8,
                        }}
                    >
                        <TextInput
                            type="email"
                            value={email === '' ? ' ' : email || user.email}
                            onChangeText={(value) => setEmail(value)}
                            editable={true}
                        />
                    </View>
                    <Controller
                        name="birthday"
                        control={control}
                        defaultValue=""
                        render={() => (
                            <KeyboardAvoidingView
                                behavior={Platform.OS == 'ios' ? 'padding' : ''}
                                style={{
                                    width: '100%',
                                }}
                            >
                                <View>
                                    <TouchableOpacity
                                        style={styles.container}
                                        onPress={handleOnPressStartDate}
                                    >
                                        <Text
                                            style={{
                                                color: '#8b9cb5',
                                                alignItems: 'center',
                                            }}
                                        >
                                            Birthday{' '}
                                        </Text>
                                        <Text>
                                            {selectedStartDate || user.date}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={openStartDatePicker}
                                >
                                    <View style={styles.centeredView}>
                                        <View style={styles.modalView}>
                                            <DatePicker
                                                mode="calendar"
                                                minimumDate={startDate}
                                                selected={startedDate}
                                                onDateChanged={
                                                    handleChangeStartDate
                                                }
                                                onSelectedChange={(date) =>
                                                    setSelectedStartDate(date)
                                                }
                                                options={{
                                                    backgroundColor: '#080516',
                                                    textHeaderColor: '#469ab6',
                                                    textDefaultColor: '#FFFFFF',
                                                    selectedTextColor: '#FFF',
                                                    mainColor: '#469ab6',
                                                    textSecondaryColor:
                                                        '#FFFFFF',
                                                    borderColor:
                                                        'rgba(122, 146, 165, 0.1)',
                                                }}
                                            />
                                            <TouchableOpacity
                                                onPress={handleOnPressStartDate}
                                            >
                                                <Text
                                                    style={{ color: 'white' }}
                                                >
                                                    Close
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>
                            </KeyboardAvoidingView>
                        )}
                    />
                    <Text style={{ marginTop: 6 }}>Gender</Text>
                    <Controller
                        name="gender"
                        defaultValue=""
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <DropDownPicker
                                style={styles.input}
                                open={genderOpen}
                                value={
                                    genderValue === 'Select Gender'
                                        ? user.gender
                                        : genderValue || user.gender
                                }
                                items={gender}
                                setOpen={setGenderOpen}
                                setValue={setGenderValue}
                                setItems={setGender}
                                placeholder="Select Gender"
                                placeholderTextColor="#8b9cb5"
                                placeholderStyle={styles.placeholderStyles}
                                onChangeValue={onChange}
                                zIndex={3000}
                                zIndexInverse={1000}
                            />
                        )}
                    />
                </View>

                <View style={styles.centeredView}>
                    <CustomButton
                        text="Save"
                        onPress={handleSubmit(onRegisterPressed)}
                    />
                </View>
            </ScrollView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    id: {
        marginBottom: 30,
        marginTop: 20,
        color: '#0039a6',
    },
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

    centeredView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    modalView: {
        margin: 20,
        backgroundColor: '#080516',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        padding: 35,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 0,
    },
});

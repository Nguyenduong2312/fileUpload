import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View, TextInput, Text } from 'react-native';
import CustomButton from './CustomButton';
import SyncStorage from 'sync-storage';

export default LoginScreen = (props) => {
    const { control, handleSubmit } = useForm();
    const [user, setUser] = useState({});

    const [id, setID] = useState('');
    const [relationOpen, setRelationOpen] = useState(false);
    const [role, setRelationValue] = useState(user.gender);
    const [relation, setRelation] = useState([
        { label: 'Father', value: 'father' },
        { label: 'Mother', value: 'mother' },
        { label: 'Child', value: 'child' },
    ]);

    const onRegisterPressed = async (e) => {
        try {
            const data = { id, role };
            console.log('daraa: ', data);
            fetch('http://192.168.1.27:5000/membership', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${SyncStorage.get('token')}`,
                },
                body: JSON.stringify(data),
            })
                .then((response) => {
                    return response.json();
                })
                .then((res) => {
                    alert(res.msg);
                })
                .catch((error) => console.log(error));
        } catch (error) {
            //setLoading(false);
            console.error(error);
        }
        //const data={id,roleRelationShip}
        //console.log(data)
    };

    return (
        <SafeAreaProvider
            style={{
                flex: 1,
                backgroundColor: 'white',
                paddingHorizontal: 22,
            }}
        >
            <View>
                <Text style={styles.title}>Add Family Member</Text>
                <View>
                    <View style={styles.input}>
                        <TextInput
                            placeholder="Enter your family member's ID"
                            placeholderTextColor="#808080"
                            onChangeText={(value) => setID(value)}
                            editable={true}
                        />
                    </View>
                </View>
            </View>

            <View>
                <Controller
                    name="relation"
                    defaultValue=""
                    control={control}
                    render={({ field: { onChange } }) => (
                        <DropDownPicker
                            style={styles.input}
                            open={relationOpen}
                            value={role}
                            items={relation}
                            setOpen={setRelationOpen}
                            setValue={setRelationValue}
                            setItems={setRelation}
                            placeholder="Choose relationship"
                            placeholderStyle={styles.placeholderStyles}
                            onChangeValue={onChange}
                            zIndex={3000}
                            zIndexInverse={1000}
                        />
                    )}
                />
            </View>
            <View style={styles.button}>
                <CustomButton
                    text="Send Request"
                    onPress={
                        (() => props.navigation.navigate('UpdateInfo'),
                        handleSubmit(onRegisterPressed))
                    }
                />
            </View>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    button: {
        flex: 1,
        marginTop: 100,
        marginBottom: 20,
        backgroundColor: 'white',
        paddingHorizontal: 22,
        allignitems: 'center',
        paddingLeft: 40,
    },
    input: {
        height: 44,
        width: '100%',
        borderColor: 'secondaryGray',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 20,

        marginVertical: 6,
        justifyContent: 'center',
        paddingLeft: 8,
    },

    placeholderStyles: {
        color: '#808080',
    },
    title: {
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 30,
        color: '#0039a6',
    },
});

import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import { useForm } from 'react-hook-form';

export default function SignUpScreen(props) {
    const { control, handleSubmit, watch } = useForm();
    const pwd = watch('password1');

    const onRegisterPressed = async (data) => {
        data.role = 'Patient';
        console.log(data);
        props.navigation.navigate('Profile');
        fetch(`http://192.168.1.9:5000/account/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                console.log('response.status', response.status);
                if (response.status === 200) {
                    props.navigation.navigate('Edit Profile');
                }
                return response.json();
            })
            .then((res) => {
                //setMessage(res.msg||'')
                console.log('res.msg', res.msg);
                alert('There was a problem with the server');
                return;
            })
            .catch((error) => console.log(error));
    };
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.root}>
                <Text style={styles.title}>Create an account</Text>

                <CustomInput
                    name="username"
                    control={control}
                    placeholder="User Name"
                    placeholderTextColor="#8b9cb5"
                    rules={{
                        required: 'Name is required',
                        minLength: {
                            value: 3,
                            message:
                                'Name should be at least 3 characters long',
                        },
                        maxLength: {
                            value: 24,
                            message: 'Name should be max 24 characters long',
                        },
                    }}
                />
                <CustomInput
                    name="password1"
                    control={control}
                    placeholder="Password"
                    placeholderTextColor="#8b9cb5"
                    secureTextEntry
                    rules={{
                        required: 'Password is required',
                        minLength: {
                            value: 8,
                            message:
                                'Password should be at least 8 characters long',
                        },
                    }}
                />
                <CustomInput
                    name="password2"
                    control={control}
                    placeholder="Repeat Password"
                    placeholderTextColor="#8b9cb5"
                    secureTextEntry
                    rules={{
                        validate: (value) =>
                            value === pwd || 'Password do not match',
                    }}
                />

                <CustomButton
                    text="Register"
                    onPress={handleSubmit(onRegisterPressed)}
                />
                <TouchableOpacity style={styles.logIn}>
                    <Text
                        style={styles.links}
                        onPress={() => props.navigation.navigate('Login')}
                    >
                        I have an account
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#ffffff',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        marginTop: 60,
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 35,
        color: '#0039a6',
    },
    text: {
        marginTop: 20,
        color: 'gray',
        marginVertical: 10,
    },
    links: {
        marginTop: 130,
        textAlign: 'center',
        textDecorationLine: 'underline',
        color: '#758580',
    },
});

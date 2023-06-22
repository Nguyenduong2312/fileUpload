import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
const CustomInput = ({
    control,
    name,
    rules = {},
    placeholder,
    secureTextEntry,
}) => {
    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({
                field: { value, onChange, onBlur },
                fieldState: { error },
            }) => (
                <>
                    <View
                        style={[
                            styles.container,
                            { borderColor: error ? 'red' : '#e8e8e8' },
                        ]}
                    >
                        <TextInput
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder={placeholder}
                            placeholderTextColor="#8b9cb5"
                            style={styles.input}
                            secureTextEntry={secureTextEntry}
                        />
                    </View>
                    {error && (
                        <Text style={{ color: 'red', alignSelf: 'stretch' }}>
                            {error.message || 'Error'}
                        </Text>
                    )}
                </>
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        flexDirection: 'row',
        height: 50,
        marginTop: 20,
        marginLeft: 0,
        margin: 10,
        borderColor: '#7DE24E',
        borderWidth: 1,
        paddingHorizontal: 20,
        marginVertical: 5,
    },
    input: {},
});

export default CustomInput;

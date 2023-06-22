import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const CustomButton = ({
    onPress,
    text,
    type = 'PRIMARY',
    bgColor,
    fgColor,
}) => {
    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.container,
                styles[`container_${type}`],
                bgColor ? { backgroundColor: bgColor } : {},
            ]}
        >
            <Text
                style={[
                    styles.text,
                    styles[`text_${type}`],
                    fgColor ? { color: fgColor } : {},
                ]}
            >
                {text}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '90%',

        padding: 15,
        marginVertical: 5,
        marginTop: 30,
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#0039a6',
    },

    text: {
        fontWeight: 'bold',
        color: 'white',
    },
});

export default CustomButton;

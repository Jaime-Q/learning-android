import React, {useState} from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';

function Login() {
    return (
        <View style={styles.container}>
            <Text> Login Session </Text>

            <TextInput
                style={styles.input}
                placeholder='joe@mail.com'
                placeholderTextColor= '#140606ff'
            />
            <TextInput
                style={styles.input}
                placeholder='********'
                placeholderTextColor= '#140606ff'
                secureTextEntry
            />

            <TouchableOpacity style={styles.button}>
                <Text style={styles.btnLoginText}> Sign in </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerText}>
                <Text style={styles.registerText}> I don't have an account <Text style={styles.btnregisterLink}> Sign up </Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 50,
        paddingTop: 80,
        paddingBottom: 40
    },

    input: {
        width: '100%',
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#020202ff",
        paddingHorizontal: 15,
        marginBottom: 20,
    },

    button: {
        width: '100%',
        backgroundColor: "#bee8deff",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
    },

    btnLoginText: {
        color: "#140606ff",
        fontSize: 16,
        fontWeight: "bold",
    },

    registerText: {
        marginTop: 20,
        fontSize: 14,
        color: "#140606ff",
    },

    btnregisterLink: {
        color: "#028f7eff",
        fontWeight: "bold",
    },
});
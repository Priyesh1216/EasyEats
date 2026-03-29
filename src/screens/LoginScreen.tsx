import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native';
import { Mail, Lock, Eye } from 'lucide-react-native';

const LoginScreen = ({ navigation }: any) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.logoCircle}>
                    <Image
                        source={require('../../assets/logo_icon.png')}
                        style={styles.logoImage}
                    />
                </View>
                <Text style={styles.title}>EasyEats</Text>
                <Text style={styles.subtitle}>Welcome back! Please login to your account.</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputBox}>
                    <Mail size={20} color="#999999" />
                    <TextInput
                        placeholder="you@example.com"
                        style={styles.inputField}
                        placeholderTextColor="#999999"
                    />
                </View>

                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputBox}>
                    <Lock size={20} color="#999999" />
                    <TextInput
                        placeholder="Enter your password"
                        secureTextEntry
                        style={styles.inputField}
                        placeholderTextColor="#999999"
                    />
                    <Eye size={20} color="#999999" />
                </View>

                <View style={styles.optionsRow}>
                    <View style={styles.rememberMeContainer}>
                        <View style={styles.checkbox} />
                        <Text style={styles.rememberText}>Remember me</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.signInBtn}
                    onPress={() => navigation.navigate('MainTabs')}
                >
                    <Text style={styles.signInBtnText}>Sign In</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.orangeLink}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
    },
    logoImage: {
        width: 45,
        height: 45,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000000',
        marginTop: 0,
        marginBottom: 0,
    },
    subtitle: {
        fontSize: 14,
        color: '#666666',
        marginTop: 8,
        marginBottom: 0,
    },
    form: {
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 40,
        marginBottom: 0,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000000',
        marginBottom: 8,
        marginTop: 0,
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 12,
        paddingLeft: 15,
        paddingRight: 15,
        height: 55,
        marginBottom: 20,
        marginTop: 0,
    },
    inputField: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#000000',
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 0,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 0,
        marginBottom: 0,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 4,
        marginRight: 8,
        marginTop: 0,
        marginBottom: 0,
    },
    rememberText: {
        fontSize: 12,
        color: '#666666',
    },
    forgotText: {
        fontSize: 12,
        color: '#FF9B85',
    },
    signInBtn: {
        backgroundColor: '#4CAF50',
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
        marginBottom: 0,
    },
    signInBtnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 0,
    },
    footerText: {
        fontSize: 14,
        color: '#666666',
    },
    orangeLink: {
        fontSize: 14,
        color: '#FF9B85',
    },
});

export default LoginScreen;
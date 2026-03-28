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
import { User, Mail, Lock, Eye } from 'lucide-react-native';

const SignUpScreen = ({ navigation }: any) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.logoCircle}>
                    <Image
                        source={require('../../assets/logo_icon.png')}
                        style={styles.logoImage}
                    />
                </View>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Simple meals, less thinking</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <View style={styles.inputBox}>
                    <User size={20} color="#999999" />
                    <TextInput placeholder="Name" style={styles.inputField} />
                </View>

                <Text style={styles.inputLabel}>Email Address *</Text>
                <View style={styles.inputBox}>
                    <Mail size={20} color="#999999" />
                    <TextInput placeholder="you@example.com" style={styles.inputField} />
                </View>

                <Text style={styles.inputLabel}>Password *</Text>
                <View style={styles.inputBox}>
                    <Lock size={20} color="#999999" />
                    <TextInput placeholder="Minimum 8 characters" secureTextEntry style={styles.inputField} />
                    <Eye size={20} color="#999999" />
                </View>

                <TouchableOpacity
                    style={styles.createBtn}
                    onPress={() => navigation.navigate('Preferences')}
                >
                    <Text style={styles.createBtnText}>Create Account</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.orangeLink}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFBFB',
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 0,
    },
    logoCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    logoImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#000000',
    },
    subtitle: {
        color: '#666666',
        marginTop: 4,
    },
    form: {
        paddingLeft: 25,
        paddingRight: 25,
        marginTop: 25,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333333',
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 12,
        paddingLeft: 15,
        paddingRight: 15,
        height: 55,
        marginBottom: 15,
    },
    inputField: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    createBtn: {
        backgroundColor: '#4CAF50',
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    createBtnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        color: '#666666',
    },
    orangeLink: {
        color: '#FF9B85',
        fontWeight: 'bold',
    },
});

export default SignUpScreen;
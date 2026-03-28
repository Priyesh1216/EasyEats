import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

const LoginScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [showPass, setShowPass] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContent}>
                <View style={styles.header}>
                    <View style={styles.logoCircle}>
                        <Image
                            source={require('../../assets/logo_icon.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.title}>EasyEats</Text>
                    <Text style={styles.subtitle}>Welcome back! Please login to your account.</Text>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.inputWrapper}>
                        <Mail size={20} color="#999" />
                        <TextInput placeholder="you@example.com" style={styles.input} />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputWrapper}>
                        <Lock size={20} color="#999" />
                        <TextInput
                            secureTextEntry={!showPass}
                            placeholder="Enter your password"
                            style={styles.input}
                        />
                        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                            {showPass ? <EyeOff size={20} color="#999" /> : <Eye size={20} color="#999" />}
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.signInBtn}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.signInBtnText}>Sign In</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.signUpLink}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    mainContent: {
        padding: 25,
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    logoImage: {
        width: '60%',
        height: '60%',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#666',
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 55,
        backgroundColor: '#FFF',
    },
    input: {
        flex: 1,
        marginLeft: 10,
    },
    signInBtn: {
        backgroundColor: '#4CAF50',
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signInBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    footerText: {
        fontSize: 14,
    },
    signUpLink: {
        color: '#FF9B85',
        fontWeight: 'bold',
    },
});

export default LoginScreen;
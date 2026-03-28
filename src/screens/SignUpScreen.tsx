import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

const SignUpScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [showPass, setShowPass] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flexOne}
            >
                <ScrollView contentContainerStyle={styles.scrollPadding}>
                    <View style={styles.header}>
                        <View style={styles.logoCircle}>
                            <Image
                                source={require('../../assets/logo_icon.png')}
                                style={styles.headerLogo}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Simple meals, less thinking</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name *</Text>
                        <View style={styles.inputWrapper}>
                            <User size={20} color="#999" />
                            <TextInput placeholder="Name" style={styles.input} />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address *</Text>
                        <View style={styles.inputWrapper}>
                            <Mail size={20} color="#999" />
                            <TextInput placeholder="you@example.com" style={styles.input} />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password *</Text>
                        <View style={styles.inputWrapper}>
                            <Lock size={20} color="#999" />
                            <TextInput
                                secureTextEntry={!showPass}
                                placeholder="Minimum 8 characters"
                                style={styles.input}
                            />
                            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                                {showPass ? <EyeOff size={20} color="#999" /> : <Eye size={20} color="#999" />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.submitBtn}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={styles.submitBtnText}>Create Account</Text>
                    </TouchableOpacity>

                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.linkText}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    flexOne: {
        flex: 1,
    },
    scrollPadding: {
        padding: 25,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerLogo: {
        width: '60%',
        height: '60%',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#666',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 50,
        backgroundColor: '#FFF',
    },
    input: {
        flex: 1,
        marginLeft: 10,
    },
    submitBtn: {
        backgroundColor: '#4CAF50',
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    submitBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        fontSize: 14,
    },
    linkText: {
        color: '#FF9B85',
        fontWeight: 'bold',
    },
});

export default SignUpScreen;
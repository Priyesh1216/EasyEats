import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image
} from 'react-native';
import { ArrowRight } from 'lucide-react-native';

const WelcomeScreen = ({ navigation }: any) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerSection}>
                <View style={styles.logoCircle}>
                    <Image
                        source={require('../../assets/logo_icon.png')}
                        style={styles.logoIcon}
                    />
                </View>
                <Text style={styles.brandName}>EasyEats</Text>
                <Text style={styles.tagline}>Meal planning made easy</Text>
            </View>

            <View style={styles.heroSection}>
                <Image
                    source={require('../../assets/food_plate.png')}
                    style={styles.heroImage}
                />
                <Text style={styles.heroText}>
                    Simple meal planning,{"\n"}made for you
                </Text>
            </View>

            <View style={styles.footerSection}>
                <TouchableOpacity
                    style={styles.getStartedBtn}
                    onPress={() => navigation.navigate('SignUp')}
                >
                    <Text style={styles.getStartedText}>Get Started</Text>
                    <View style={styles.arrowCircle}>
                        <ArrowRight size={20} color="#FFFFFF" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.loginLinkContainer}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.loginBaseText}>
                        Already have an account? <Text style={styles.orangeText}>Sign in</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerSection: {
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
    logoIcon: {
        width: 45,
        height: 45,
        resizeMode: 'contain',
    },
    brandName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginTop: 0,
        marginBottom: 0,
    },
    tagline: {
        fontSize: 14,
        color: '#666666',
        marginTop: 5,
        marginBottom: 0,
    },
    heroSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 0,
    },
    heroImage: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
    },
    heroText: {
        fontSize: 22,
        fontWeight: '500',
        color: '#333333',
        textAlign: 'center',
        marginTop: 40,
        marginBottom: 0,
        lineHeight: 28,
    },
    footerSection: {
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 40,
        paddingTop: 0,
        alignItems: 'center',
    },
    getStartedBtn: {
        flexDirection: 'row',
        backgroundColor: '#4CAF50',
        width: '100%',
        height: 60,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    getStartedText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    arrowCircle: {
        position: 'absolute',
        right: 15,
        width: 35,
        height: 35,
        borderRadius: 10,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginLinkContainer: {
        marginTop: 15,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
    },
    loginBaseText: {
        color: '#666666',
        fontSize: 12,
    },
    orangeText: {
        color: '#FF9B85',
        fontWeight: 'bold',
    },
});

export default WelcomeScreen;
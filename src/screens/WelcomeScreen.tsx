import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

const { width } = Dimensions.get('window');

const WelcomeScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <View style={styles.logoCircle}>
                    <Image
                        source={require('../../assets/logo_icon.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                </View>
                <Text style={styles.brandText}>EasyEats</Text>
                <Text style={styles.subBrandText}>Meal planning made easy</Text>
            </View>

            <View style={styles.imageWrapper}>
                <Image
                    source={require('../../assets/food_plate.png')}
                    style={styles.plateImage}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.footer}>
                <Text style={styles.mainHeadline}>
                    Simple meal planning,{"\n"}made for you
                </Text>

                <TouchableOpacity
                    style={styles.getStartedBtn}
                    onPress={() => navigation.navigate('SignUp')}
                >
                    <View style={styles.btnContent}>
                        <View style={styles.spacer} />
                        <Text style={styles.btnText}>Get Started</Text>
                        <View style={styles.arrowBox}>
                            <Text style={styles.arrowIcon}>→</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={styles.loginRow}>
                    <Text style={styles.accountText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.signInLink}>Sign in</Text>
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
        marginTop: 40,
    },
    logoCircle: {
        width: 75,
        height: 75,
        borderRadius: 37.5,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    logoImage: {
        width: '60%',
        height: '60%',
    },
    brandText: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    subBrandText: {
        fontSize: 14,
        color: '#FF9B85',
        fontWeight: '500',
    },
    imageWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    plateImage: {
        width: width * 0.8,
        height: width * 0.8,
    },
    footer: {
        paddingHorizontal: 25,
        paddingBottom: 40,
        alignItems: 'center',
    },
    mainHeadline: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 30,
    },
    getStartedBtn: {
        backgroundColor: '#4CAF50',
        width: '100%',
        height: 60,
        borderRadius: 12,
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    btnContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    spacer: {
        width: 44,
    },
    btnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    arrowBox: {
        backgroundColor: '#000',
        width: 44,
        height: 44,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowIcon: {
        color: '#FFF',
        fontSize: 20,
    },
    loginRow: {
        flexDirection: 'row',
        marginTop: 20,
    },
    accountText: {
        color: '#666',
    },
    signInLink: {
        color: '#FF9B85',
        fontWeight: 'bold',
    },
});

export default WelcomeScreen;
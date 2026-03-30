import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Image
} from 'react-native';
import { Bell, Shield, History, HelpCircle, LogOut, ChevronRight, User } from 'lucide-react-native';

const ProfileScreen = ({ navigation }: any) => {
    const SettingItem = ({ icon: Icon, label, sublabel }: any) => (
        <TouchableOpacity style={styles.settingsBox}>
            <Icon size={22} color="#333" />
            <View style={styles.settingsText}>
                <Text style={styles.settingsLabel}>{label}</Text>
                <Text style={styles.settingsSub}>{sublabel}</Text>
            </View>
            <ChevronRight size={20} color="#CCC" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Profile</Text>

                <View style={styles.profileCard}>
                    <View style={styles.avatarCircle}>
                        <User size={40} color="#4CAF50" />
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>Sarah Jones</Text>
                        <Text style={styles.userEmail}>sarahjones@email.com</Text>
                        <Text style={styles.userPhone}>+1 (514)-123-4567</Text>
                    </View>
                    <TouchableOpacity style={styles.editBtn}>
                        <Text style={styles.editText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.prefSection}>
                    <Text style={styles.secTitle}>Preferences</Text>
                    <View style={styles.prefBox}>
                        <View style={styles.prefRow}>
                            <Text style={styles.prefLabel}>Time Available</Text>
                            <Text style={styles.prefValue}>≤ 40 mins</Text>
                        </View>
                        <View style={styles.prefRow}>
                            <Text style={styles.prefLabel}>Effort Level</Text>
                            <Text style={styles.prefValue}>Medium</Text>
                        </View>
                        <View style={styles.prefRow}>
                            <Text style={styles.prefLabel}>Allergies</Text>
                            <Text style={styles.prefValue}>None</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Preferences', { isEditMode: true })}
                        >
                            <Text style={styles.editPrefLink}>Edit preferences</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.settingsSection}>
                    <Text style={styles.secTitle}>Settings</Text>
                    <SettingItem
                        icon={Bell}
                        label="Notifications"
                        sublabel="Manage your notification preferences"
                    />
                    <SettingItem
                        icon={Shield}
                        label="Privacy & Security"
                        sublabel="Control your privacy settings"
                    />
                    <SettingItem
                        icon={History}
                        label="History/Saved Meals"
                        sublabel="View past and saved meals"
                    />
                    <SettingItem
                        icon={HelpCircle}
                        label="Help & Support"
                        sublabel="Get help with the app"
                    />

                    <TouchableOpacity style={styles.logoutBtn}
                         onPress={() => navigation.navigate('Welcome')}>
                        <LogOut size={20} color="#FF0000" />
                        <Text style={styles.logoutText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 20,
    },
    profileCard: {
        backgroundColor: '#FFF',
        margin: 20,
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#333',
        alignItems: 'center',
    },
    avatarCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    userInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    userEmail: {
        color: '#666',
        fontSize: 14,
    },
    userPhone: {
        color: '#999',
        fontSize: 12,
    },
    editBtn: {
        width: '100%',
        height: 45,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editText: {
        color: '#4CAF50',
        fontWeight: '700',
    },
    secTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 20,
        marginBottom: 10,
    },
    prefSection: {
        marginBottom: 25,
    },
    prefBox: {
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    prefRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    prefLabel: {
        color: '#999',
        fontSize: 14,
    },
    prefValue: {
        fontWeight: '600',
        color: '#333',
    },
    editPrefLink: {
        color: '#FF9B85',
        fontWeight: 'bold',
        marginTop: 5,
    },
    settingsSection: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    settingsBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    settingsText: {
        flex: 1,
        marginLeft: 15,
    },
    settingsLabel: {
        fontSize: 15,
        fontWeight: '700',
    },
    settingsSub: {
        fontSize: 12,
        color: '#999',
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 18,
        borderWidth: 1,
        borderColor: '#333',
        gap: 15,
        marginTop: 10,
    },
    logoutText: {
        color: '#FF0000',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ProfileScreen;
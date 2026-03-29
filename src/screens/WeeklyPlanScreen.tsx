import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity,
    ScrollView
} from 'react-native';

const WeeklyPlanScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Weekly Planner</Text>
                    <Text style={styles.subtitle}>Plan your meals for the week, your way</Text>
                </View>
                <Image
                    source={require('../../assets/custom_logo.png')}
                    style={styles.headerLogo}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.dayHeader}>
                    <Text style={styles.dayLabel}>Sunday, April 5, 2026</Text>
                    <TouchableOpacity style={styles.addBtn}>
                        <Text style={styles.addBtnText}>ADD MEAL +</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.emptyPlaceholder}>
                    <Text style={styles.placeholderText}>No meals planned yet</Text>
                </View>

                <View style={styles.dayHeader}>
                    <Text style={styles.dayLabel}>Monday, April 6, 2026</Text>
                    <TouchableOpacity style={styles.addBtn}>
                        <Text style={styles.addBtnText}>ADD MEAL +</Text>
                    </TouchableOpacity>
                </View>

                {/* Example of a planned meal could go here */}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        marginTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#666',
        fontSize: 14,
        marginTop: 5,
    },
    headerLogo: {
        width: 45,
        height: 45,
        resizeMode: 'contain',
    },
    scroll: {
        paddingHorizontal: 25,
        paddingBottom: 30,
    },
    dayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 35,
        marginBottom: 15,
    },
    dayLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    addBtn: {
        backgroundColor: '#C8E6C9',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addBtnText: {
        color: '#2E7D32',
        fontSize: 12,
        fontWeight: 'bold',
    },
    emptyPlaceholder: {
        height: 60,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EEE',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#999',
        fontSize: 14,
    },
});

export default WeeklyPlanScreen;
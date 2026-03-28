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
import { SlidersHorizontal, Search } from 'lucide-react-native';

const HomeScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Welcome, Sarah</Text>
                    <Text style={styles.subText}>Find a meal that fits your day</Text>
                </View>
                <Image
                    source={require('../../assets/custom_logo.png')}
                    style={styles.headerLogo}
                />
            </View>

            <View style={styles.searchRow}>
                <View style={styles.searchBar}>
                    <Search size={20} color="#999999" />
                    <TextInput
                        placeholder="Search Meals or Ingredients"
                        style={styles.searchInput}
                    />
                </View>
                <TouchableOpacity style={styles.filterBtn}>
                    <SlidersHorizontal size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.emptyContainer}>
                <Text style={styles.emptyNote}>No meals to display yet.</Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
    },
    subText: {
        fontSize: 14,
        color: '#666666',
    },
    headerLogo: {
        width: 45,
        height: 45,
        resizeMode: 'contain',
    },
    searchRow: {
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 20,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingLeft: 15,
        paddingRight: 15,
        height: 50,
        borderWidth: 1,
        borderColor: '#000000',
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
    },
    filterBtn: {
        backgroundColor: '#4CAF50',
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyNote: {
        color: '#999999',
    },
});

export default HomeScreen;
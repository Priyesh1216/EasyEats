import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView
} from 'react-native';
import { SlidersHorizontal, Search } from 'lucide-react-native';

const FavoritesScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.title}>Favorites</Text>
                    <Text style={styles.subtitle}>Your saved meal collection</Text>
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
                        placeholder="Search Saved Meals"
                        style={styles.searchInput}
                        placeholderTextColor="#999999"
                    />
                </View>
                <TouchableOpacity style={styles.filterBtn}>
                    <SlidersHorizontal size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyNote}>No favorites saved yet.</Text>
                </View>
            </ScrollView>
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
        marginBottom: 0,
    },
    headerTextContainer: {
        marginTop: 0,
        marginBottom: 0,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000000',
    },
    subtitle: {
        color: '#666666',
        fontSize: 14,
        marginTop: 5,
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
        marginBottom: 0,
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
        color: '#000000',
    },
    filterBtn: {
        backgroundColor: '#4CAF50',
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
    },
    emptyNote: {
        color: '#999999',
        fontSize: 14,
    },
});

export default FavoritesScreen;
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity
} from 'react-native';

const GroceryListScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.title}>Grocery List</Text>
                    <Text style={styles.subtitle}>Manage your shopping list</Text>
                </View>
                <Image
                    source={require('../../assets/custom_logo.png')}
                    style={styles.headerLogo}
                />
            </View>

            <View style={styles.emptyContainer}>
                <Text style={styles.emptyNote}>Your list is empty.</Text>
            </View>

            <TouchableOpacity style={styles.addBtn}>
                <Text style={styles.addBtnText}>Add Item</Text>
            </TouchableOpacity>
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
        paddingLeft: 25,
        paddingRight: 25,
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
        marginTop: 4,
    },
    headerLogo: {
        width: 45,
        height: 45,
        resizeMode: 'contain',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 0,
        paddingRight: 0,
        marginTop: 0,
        marginBottom: 0,
    },
    emptyNote: {
        color: '#999999',
        fontSize: 14,
    },
    addBtn: {
        backgroundColor: '#4CAF50',
        height: 55,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 25,
        marginRight: 25,
        marginTop: 0,
        marginBottom: 25,
    },
    addBtnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default GroceryListScreen;
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';



const PreferencesScreen = ({ route, navigation }: any) => {
    const isEditMode = route.params?.isEditMode ?? false;

    const OptionBox = ({ label, placeholder }: any) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.dropdown}>
                <Text style={styles.dropText}>{placeholder}</Text>
                <ChevronDown size={20} color="#333" />
            </View>
        </View>
    );

    const ChoiceRow = ({ label, choices, active }: any) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.row}>
                {choices.map((item: string, idx: number) => (
                    <TouchableOpacity
                        key={item}
                        style={[styles.chip, active === idx && styles.activeChip]}
                    >
                        <Text style={[styles.chipText, active === idx && styles.activeChipText]}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    {/* The Top Right Button: Toggles between Skip and Cancel */}
                    <TouchableOpacity
                        style={styles.skip}
                        onPress={() => {
                            if (isEditMode) {
                                navigation.goBack(); // Return to Profile if cancelling
                            } else {
                                navigation.navigate('MainTabs'); // Skip to Home if signing up
                            }
                        }}
                    >
                        <Text style={styles.skipText}>
                            {isEditMode ? 'Cancel' : 'Skip for now'}
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.title}>
                        {isEditMode ? 'Edit Preferences' : 'Set Your Meal Preferences'}
                    </Text>
                    <Text style={styles.subtitle}>Helps us suggest meals for you</Text>
                </View>

                <OptionBox label="Time Available *" placeholder="Select time..." />

                <ChoiceRow
                    label="Effort Level *"
                    choices={['Low', 'Medium', 'High']}
                    active={0}
                />

                <OptionBox label="Allergies *" placeholder="Select all that apply" />
                <OptionBox label="Dietary Prefrences *" placeholder="Select all that apply" />

                <ChoiceRow
                    label="Cooking Skills"
                    choices={['Beginner', 'Intermediate', 'Advanced']}
                    active={0}
                />

                <OptionBox label="Likes" placeholder="Select all that apply" />
                <OptionBox label="Dislikes" placeholder="Select all that apply" />

                {/* The Main Bottom Button: Toggles between Save and Continue */}
                <TouchableOpacity
                    style={styles.mainBtn}
                    onPress={() => {
                        if (isEditMode) {
                            // You'd usually save to Firebase here
                            navigation.goBack(); // Return to Profile after saving
                        } else {
                            navigation.navigate('MainTabs'); // Proceed to Home
                        }
                    }}
                >
                    <Text style={styles.mainBtnText}>
                        {isEditMode ? 'Save' : 'Continue'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    scroll: {
        paddingHorizontal: 25,
        paddingBottom: 40,
    },
    header: {
        marginTop: 20,
        marginBottom: 25,
    },
    skip: {
        alignSelf: 'flex-end',
    },
    skipText: {
        color: '#FF9B85',
        fontSize: 14,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 5,
    },
    subtitle: {
        color: '#666',
        fontSize: 14,
        marginTop: 5,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#CCC',
        height: 50,
        paddingHorizontal: 15,
    },
    dropText: {
        color: '#999',
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    chip: {
        flex: 1,
        height: 45,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#CCC',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    activeChip: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    chipText: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    activeChipText: {
        color: '#FFF',
    },
    mainBtn: {
        backgroundColor: '#4CAF50',
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    mainBtnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PreferencesScreen;
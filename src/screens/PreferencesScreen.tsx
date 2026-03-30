import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    TextInput
} from 'react-native';
import { MultiSelect, Dropdown } from 'react-native-element-dropdown';
import { ChevronDown } from 'lucide-react-native';

interface DropdownItem {
    label: string;
    value: string;
}

const PreferencesScreen = ({ route, navigation }: any) => {
    
    const isEditMode = route.params?.isEditMode ?? false;
    const [time, setTime] = useState<string | null>(null);
    const [effort, setEffort] = useState<string>('Low');
    const [skill, setSkill] = useState<string>('Beginner');
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
    const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

    const [otherTime, setOtherTime] = useState('');
    const [otherAllergy, setOtherAllergy] = useState('');
    const [otherDietary, setOtherDietary] = useState('');
    const [likes, setLikes] = useState('');
    const [dislikes, setDislikes] = useState('');

    const timeOptions: DropdownItem[] = [
        { label: 'Under 15 min', value: '15' },
        { label: '15 - 30 min', value: '30' },
        { label: '30 - 60 min', value: '60' },
        { label: 'Other', value: 'other' },
    ];

    const allergyOptions: DropdownItem[] = [
        { label: 'Nuts', value: 'Nuts' },
        { label: 'Dairy', value: 'Dairy' },
        { label: 'Gluten', value: 'Gluten' },
        { label: 'Other', value: 'other' },
    ];

    const dietaryOptions: DropdownItem[] = [
        { label: 'Vegan', value: 'Vegan' },
        { label: 'Vegetarian', value: 'Vegetarian' },
        { label: 'Keto', value: 'Keto' },
        { label: 'Other', value: 'other' },
    ];

    const handleContinue = () => {
        const filters = {
            effort,
            skill,
            allergies: selectedAllergies.includes('other')
                ? [...selectedAllergies.filter(a => a !== 'other'), otherAllergy]
                : selectedAllergies,
            dietary: selectedDietary.includes('other')
                ? [...selectedDietary.filter(d => d !== 'other'), otherDietary]
                : selectedDietary,
            maxTime: time === 'other' ? otherTime : time,
            likes,
            dislikes
        };

        if (isEditMode) {
        // Logic to save filters to your database would go here
        navigation.goBack(); // Takes her back to Profile after saving
    } else {
        navigation.navigate('MainTabs', {
            screen: 'Home',
            params: { filterUpdate: filters }
        });
    };

};
        const handleSkip = () => {
            if (isEditMode) {
                navigation.goBack(); 
            } else {
                navigation.navigate('MainTabs');
            }
        };

    

    const renderToggleButton = (label: string, currentValue: string, setter: (val: string) => void) => (
        <TouchableOpacity
            style={[styles.toggleBtn, currentValue === label && styles.toggleBtnActive]}
            onPress={() => setter(label)}
        >
            <Text style={[styles.toggleText, currentValue === label && styles.toggleTextActive]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    
                    <TouchableOpacity onPress={handleSkip} style={styles.skipTouchArea}>
                        <Text style={styles.skipText}>
                            {isEditMode ? 'Cancel' : 'Skip for now'}
                            </Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>
                    {isEditMode ? 'Edit Your Preferences' : 'Set Your Meal Preferences'}
                </Text>
                <Text style={styles.subtitle}>Helps us suggest meals for you</Text>

                <View style={styles.section}>
                    <Text style={styles.label}>Time Available *</Text>
                    <Dropdown
                        style={styles.dropdown}
                        data={timeOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="Select time range"
                        value={time}
                        onChange={(item: DropdownItem) => setTime(item.value)}
                        renderRightIcon={() => <ChevronDown size={20} color="#666" />}
                    />
                    {time === 'other' && (
                        <TextInput
                            style={styles.otherInput}
                            placeholder="Specify time..."
                            value={otherTime}
                            onChangeText={setOtherTime}
                        />
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Effort Level *</Text>
                    <View style={styles.row}>
                        {['Low', 'Medium', 'High'].map(val => renderToggleButton(val, effort, setEffort))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Allergies *</Text>
                    <MultiSelect
                        style={styles.dropdown}
                        data={allergyOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="Select all that apply"
                        value={selectedAllergies}
                        onChange={(item: string[]) => setSelectedAllergies(item)}
                        renderRightIcon={() => <ChevronDown size={20} color="#666" />}
                    />
                    {selectedAllergies.includes('other') && (
                        <TextInput
                            style={styles.otherInput}
                            placeholder="List other allergies..."
                            value={otherAllergy}
                            onChangeText={setOtherAllergy}
                        />
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Dietary Preferences *</Text>
                    <MultiSelect
                        style={styles.dropdown}
                        data={dietaryOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="Select all that apply"
                        value={selectedDietary}
                        onChange={(item: string[]) => setSelectedDietary(item)}
                        renderRightIcon={() => <ChevronDown size={20} color="#666" />}
                    />
                    {selectedDietary.includes('other') && (
                        <TextInput
                            style={styles.otherInput}
                            placeholder="Specify dietary..."
                            value={otherDietary}
                            onChangeText={setOtherDietary}
                        />
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Cooking Skills</Text>
                    <View style={styles.row}>
                        {['Beginner', 'Intermediate', 'Advanced'].map(val => renderToggleButton(val, skill, setSkill))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Likes</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.textInputStyle}
                            placeholder="Enter your favorites..."
                            value={likes}
                            onChangeText={setLikes}
                        />
                        <ChevronDown size={20} color="#666" />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Dislikes</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.textInputStyle}
                            placeholder="Enter your dislikes..."
                            value={dislikes}
                            onChangeText={setDislikes}
                        />
                        <ChevronDown size={20} color="#666" />
                    </View>
                </View>

               <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
                    <Text style={styles.continueText}>{isEditMode ? 'Save' : 'Continue'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    scrollContent: { paddingHorizontal: 24, paddingBottom: 50 },
    header: { alignItems: 'flex-end', marginTop: 10, marginBottom: 10 },
    skipTouchArea: { padding: 5 },
    skipText: { color: '#FF8A65', fontSize: 16, fontWeight: '600' },
    title: { fontSize: 26, fontWeight: '800', color: '#000' },
    subtitle: { fontSize: 15, color: '#888', marginTop: 5, marginBottom: 25 },
    section: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 10 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    toggleBtn: {
        width: '31%',
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#58C158',
        alignItems: 'center',
    },
    toggleBtnActive: { backgroundColor: '#58C158', borderColor: '#58C158' },
    toggleText: { fontSize: 13, fontWeight: '700', color: '#58C158' },
    toggleTextActive: { color: '#FFF' },
    dropdown: {
        height: 50,
        borderColor: '#CCC',
        borderWidth: 1.5,
        borderRadius: 10,
        paddingHorizontal: 15,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#CCC',
        borderWidth: 1.5,
        borderRadius: 10,
        height: 50,
        paddingHorizontal: 15,
    },
    textInputStyle: { flex: 1, fontSize: 15 },
    otherInput: {
        height: 40,
        borderBottomWidth: 1.5,
        borderBottomColor: '#58C158',
        marginTop: 8,
        fontSize: 14,
        paddingHorizontal: 5,
        color: '#333'
    },
    continueBtn: {
        backgroundColor: '#58C158',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    continueText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
});

export default PreferencesScreen;
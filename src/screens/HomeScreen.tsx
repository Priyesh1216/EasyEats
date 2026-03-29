import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator,
    Modal,
    ScrollView,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StatusBar
} from 'react-native';
import {
    SlidersHorizontal,
    Search,
    Clock,
    Users,
    Heart,
    Plus,
    X,
    AlertCircle,
    PlusCircle
} from 'lucide-react-native';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const { height, width } = Dimensions.get('window');

const HomeScreen = () => {
    const [allMeals, setAllMeals] = useState<any[]>([]);
    const [filteredMeals, setFilteredMeals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('healthy');
    const [selectedMeal, setSelectedMeal] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [customAllergy, setCustomAllergy] = useState('');
    const [customDietary, setCustomDietary] = useState('');
    const [filters, setFilters] = useState({
        allergies: [] as string[],
        dietary: [] as string[],
        effort: '' as string,
    });

    const categories = [
        { label: 'Healthy', value: 'healthy' },
        { label: 'Quick', value: 'quick' },
        { label: 'Budget', value: 'budget' },
    ];

    const predefinedAllergies = ['Nuts', 'Dairy', 'Gluten', 'Shellfish'];
    const effortOptions = ['Easy', 'Medium', 'Hard'];

    const hasActiveFilters = filters.allergies.length > 0 || filters.dietary.length > 0 || filters.effort !== '';

    const fetchMeals = async (category: string) => {
        setLoading(true);
        try {
            const q = query(collection(db, 'meals'), where('category', 'array-contains', category));
            const snapshot = await getDocs(q);
            const fetched = snapshot.docs.map(doc => ({
                id: doc.id,
                favorited: false,
                ...doc.data()
            }));
            setAllMeals(fetched);
        } catch (error) {
            console.error("Firebase Error: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMeals(activeCategory); }, [activeCategory]);

    useEffect(() => {
        let results = [...allMeals];
        if (searchQuery.trim() !== '') {
            const q = searchQuery.toLowerCase();
            results = results.filter(m =>
                m.name.toLowerCase().includes(q) ||
                m.description.toLowerCase().includes(q)
            );
        }
        if (filters.allergies.length > 0) {
            results = results.filter(m => !m.dietaryPreferences?.some((p: string) => filters.allergies.includes(p)));
        }
        if (filters.dietary.length > 0) {
            results = results.filter(m => m.dietaryPreferences?.some((p: string) => filters.dietary.includes(p)));
        }
        if (filters.effort !== '') {
            results = results.filter(m => m.effortLevel === filters.effort);
        }
        setFilteredMeals(results);
    }, [searchQuery, allMeals, filters]);

    const toggleFavorite = async (mealId: string) => {
        const mealToUpdate = allMeals.find(m => m.id === mealId);
        if (!mealToUpdate) return;
        const newStatus = !mealToUpdate.favorited;

        const updateArray = (arr: any[]) => arr.map(m => m.id === mealId ? { ...m, favorited: newStatus } : m);
        setAllMeals(prev => updateArray(prev));
        setFilteredMeals(prev => updateArray(prev));
        if (selectedMeal?.id === mealId) setSelectedMeal({ ...selectedMeal, favorited: newStatus });

        try {
            await updateDoc(doc(db, 'meals', mealId), { favorited: newStatus });
        } catch (error) {
            console.error("Firestore Update Failed: ", error);
        }
    };

    const toggleFilter = (type: 'allergies' | 'dietary', value: string) => {
        setFilters(prev => ({
            ...prev,
            [type]: prev[type].includes(value) ? prev[type].filter(i => i !== value) : [...prev[type], value]
        }));
    };

    const addCustomItem = (type: 'allergies' | 'dietary') => {
        const val = type === 'allergies' ? customAllergy : customDietary;
        if (val.trim() === '') return;
        if (!filters[type].includes(val.trim())) toggleFilter(type, val.trim());
        type === 'allergies' ? setCustomAllergy('') : setCustomDietary('');
    };

    const FilterChip = ({ label, isSelected, onPress, isRemovable }: any) => (
        <TouchableOpacity
            style={[styles.chip, isSelected && styles.chipSelected, isRemovable && styles.activePill]}
            onPress={onPress}
        >
            <Text style={[styles.chipText, (isSelected || isRemovable) && styles.chipTextSelected]}>{label}</Text>
            {isRemovable && <X size={14} color="#FFF" style={{ marginLeft: 6 }} />}
        </TouchableOpacity>
    );

    const MealCard = ({ meal }: any) => (
        <TouchableOpacity style={styles.cardContainer} onPress={() => setSelectedMeal(meal)}>
            <View style={styles.card}>
                <Image source={{ uri: meal.imageUrl }} style={styles.cardImage} />
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle} numberOfLines={1}>{meal.name}</Text>
                        <View style={styles.plusBtn}><Plus size={18} color="#000" strokeWidth={3} /></View>
                    </View>
                    <Text style={styles.cardDescription} numberOfLines={1}>{meal.description}</Text>
                    <View style={styles.cardMetaStack}>
                        <View style={styles.metaRow}>
                            <Clock size={16} color="#FF8A65" />
                            <Text style={styles.cardMetaText}>{meal.timeMinutes} min</Text>
                        </View>
                        <View style={styles.metaRow}>
                            <Users size={16} color="#FF8A65" />
                            <Text style={styles.cardMetaText}>{meal.servings} servings</Text>
                        </View>
                    </View>
                    <View style={styles.cardFooter}>
                        <Text style={styles.cardBadge}>
                            {meal.effortLevel}   |   {meal.cost}
                            {meal.dietaryPreferences && meal.dietaryPreferences.length > 0
                                ? `   |   ${meal.dietaryPreferences[0]}`
                                : ''}
                        </Text>
                        <TouchableOpacity style={styles.heartCircle} onPress={() => toggleFavorite(meal.id)}>
                            <Heart size={22} color={meal.favorited ? "#FF0000" : "#000"} fill={meal.favorited ? "#FF0000" : "transparent"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            {loading ? (
                <View style={styles.loaderContainer}><ActivityIndicator size="large" color="#68BB59" /></View>
            ) : (
                <FlatList
                    data={filteredMeals}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <MealCard meal={item} />}
                    ListHeaderComponent={
                        <View style={styles.stickyHeaderContent}>
                            <View style={styles.header}>
                                <View><Text style={styles.welcomeText}>Welcome, Sarah</Text><Text style={styles.subText}>Find a meal that fits your day</Text></View>
                                <Image source={require('../../assets/custom_logo.png')} style={styles.headerLogo} />
                            </View>
                            <View style={styles.searchRow}>
                                <View style={styles.searchBar}>
                                    <Search size={20} color="#666" />
                                    <TextInput placeholder="Search Meals" style={styles.searchInput} value={searchQuery} onChangeText={setSearchQuery} />
                                </View>
                                <TouchableOpacity style={styles.filterBtn} onPress={() => setIsFilterVisible(true)}><SlidersHorizontal size={22} color="#FFF" /></TouchableOpacity>
                            </View>

                            {hasActiveFilters && (
                                <View style={styles.activeFiltersContainer}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activeFiltersScroll}>
                                        {filters.effort !== '' && <FilterChip label={filters.effort} isRemovable onPress={() => setFilters(p => ({ ...p, effort: '' }))} />}
                                        {filters.dietary.map(item => <FilterChip key={item} label={item} isRemovable onPress={() => toggleFilter('dietary', item)} />)}
                                        {filters.allergies.map(item => <FilterChip key={item} label={`No ${item}`} isRemovable onPress={() => toggleFilter('allergies', item)} />)}
                                    </ScrollView>
                                </View>
                            )}

                            <View style={styles.categoryRow}>
                                {categories.map(cat => (
                                    <TouchableOpacity key={cat.value} style={[styles.categoryBtn, activeCategory === cat.value && styles.categoryBtnActive]} onPress={() => setActiveCategory(cat.value)}>
                                        <Text style={[styles.categoryBtnText, activeCategory === cat.value && styles.categoryBtnTextActive]}>{cat.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <Text style={styles.sectionTitle}>Suggested Meals</Text>
                        </View>
                    }
                    stickyHeaderIndices={[0]}
                    contentContainerStyle={styles.listBottomPadding}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <Modal visible={isFilterVisible} animationType="slide" transparent={true}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.filterOverlay}>
                    <View style={styles.filterMenu}>
                        <View style={styles.filterHeader}>
                            <Text style={styles.filterMenuTitle}>Filters</Text>
                            <TouchableOpacity onPress={() => setIsFilterVisible(false)}><X size={24} color="#000" /></TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.filterSectionLabel}>Allergies (Exclude)</Text>
                            <View style={styles.inputRow}>
                                <TextInput style={styles.customInput} placeholder="Add custom allergy..." value={customAllergy} onChangeText={setCustomAllergy} />
                                <TouchableOpacity onPress={() => addCustomItem('allergies')}><PlusCircle size={32} color="#000" /></TouchableOpacity>
                            </View>
                            <View style={styles.chipRow}>
                                {predefinedAllergies.map(item => (
                                    <FilterChip key={item} label={item} isSelected={filters.allergies.includes(item)} onPress={() => toggleFilter('allergies', item)} />
                                ))}
                            </View>
                        </ScrollView>
                        <TouchableOpacity style={styles.applyBtn} onPress={() => setIsFilterVisible(false)}><Text style={styles.applyBtnText}>Apply Filters</Text></TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <Modal visible={!!selectedMeal} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <Image source={{ uri: selectedMeal?.imageUrl }} style={styles.absoluteHero} blurRadius={2} />

                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedMeal(null)}>
                            <X size={28} color="#000" strokeWidth={2.5} />
                        </TouchableOpacity>

                        <View style={styles.detailInfoBox}>
                            <ScrollView
                                style={styles.internalScrollView}
                                contentContainerStyle={styles.innerScrollContent}
                                showsVerticalScrollIndicator={true}
                                indicatorStyle="black"
                                decelerationRate="fast"
                            >
                                {/* Header Section inside ScrollView */}
                                <View style={styles.detailHeaderSection}>
                                    <Image source={{ uri: selectedMeal?.imageUrl }} style={styles.detailThumb} />
                                    <View style={styles.detailHeaderText}>
                                        <View style={styles.titleRow}>
                                            <Text style={styles.detailTitle}>{selectedMeal?.name}</Text>
                                            <TouchableOpacity
                                                style={styles.detailHeartBtn}
                                                onPress={() => toggleFavorite(selectedMeal!.id)}
                                            >
                                                <Heart
                                                    size={24}
                                                    color={selectedMeal?.favorited ? "#FF0000" : "#000"}
                                                    fill={selectedMeal?.favorited ? "#FF0000" : "transparent"}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.detailSubText}>{selectedMeal?.description}</Text>

                                        <View style={styles.detailMetaContainer}>
                                            <View style={styles.metaRow}>
                                                <Clock size={18} color="#FF8A65" />
                                                <Text style={styles.detailMetaValue}>{selectedMeal?.timeMinutes} min</Text>
                                            </View>
                                            <View style={styles.metaRow}>
                                                <Users size={18} color="#FF8A65" />
                                                <Text style={styles.detailMetaValue}>{selectedMeal?.servings} servings</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.detailDivider} />

                                {/* Ingredients Section */}
                                <View style={styles.detailSection}>
                                    <Text style={styles.sectionHeading}>Ingredients</Text>
                                    <View style={styles.ingredientsList}>
                                        {selectedMeal?.ingredients?.map((item: any, index: number) => (
                                            <View key={index} style={styles.ingredientRow}>
                                                <Text style={styles.bulletPoint}>•</Text>
                                                <Text style={styles.ingredientText}>
                                                    <Text style={styles.ingredientAmount}>{item.amount} </Text>
                                                    {item.name}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>

                                {/* Steps Section */}
                                <View style={styles.detailSection}>
                                    <Text style={styles.sectionHeading}>Instructions</Text>
                                    <View style={styles.stepsList}>
                                        {selectedMeal?.steps?.map((step: string, index: number) => (
                                            <View key={index} style={styles.stepContainer}>
                                                <View style={styles.stepNumberCircle}>
                                                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                                                </View>
                                                <Text style={styles.stepContentText}>{step}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // --- LAYOUT & MAIN ---
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    stickyHeaderContent: { backgroundColor: '#FFFFFF', paddingBottom: 15, zIndex: 10 },
    header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 10 },
    welcomeText: { fontSize: 26, fontWeight: '800', color: '#1A1A1A' },
    subText: { fontSize: 14, color: '#666', marginTop: 2 },
    headerLogo: { width: 50, height: 50, borderRadius: 25 },

    // --- SEARCH & CATEGORY ---
    searchRow: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 20 },
    searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8F8', borderRadius: 12, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: '#EEE', marginRight: 10 },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
    filterBtn: { backgroundColor: '#68BB59', width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    categoryRow: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 20, justifyContent: 'space-between' },
    categoryBtn: { width: '31%', paddingVertical: 12, borderRadius: 12, borderWidth: 2, borderColor: '#68BB59', alignItems: 'center', backgroundColor: '#FFF' },
    categoryBtnActive: { backgroundColor: '#68BB59' },
    categoryBtnText: { color: '#68BB59', fontWeight: '800', fontSize: 14 },
    categoryBtnTextActive: { color: '#FFFFFF' },

    // --- ACTIVE FILTERS ---
    activeFiltersContainer: { marginTop: 12, height: 40 },
    activeFiltersScroll: { paddingHorizontal: 20 },
    activePill: { backgroundColor: '#68BB59', borderRadius: 20, paddingHorizontal: 12, height: 32, marginRight: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },

    // --- MEAL CARDS ---
    sectionTitle: { fontSize: 18, fontWeight: '700', paddingHorizontal: 22, marginTop: 25 },
    listBottomPadding: { paddingBottom: 40 },
    cardContainer: { backgroundColor: '#FFF', borderRadius: 15, marginHorizontal: 20, marginTop: 15, padding: 8, borderWidth: 3, borderColor: '#68BB59' },
    card: { flexDirection: 'row' },
    cardImage: { width: 100, height: 100, borderRadius: 8 },
    cardContent: { flex: 1, paddingLeft: 12, justifyContent: 'space-between' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardTitle: { fontSize: 16, fontWeight: '700', color: '#111', flex: 1 },
    plusBtn: { backgroundColor: '#E0E0E0', borderRadius: 8, padding: 6 },
    cardDescription: { fontSize: 13, color: '#555', marginTop: 2 },
    cardMetaStack: { marginTop: 6 },
    metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    cardMetaText: { fontSize: 14, color: '#333', marginLeft: 10, fontWeight: '400' },
    cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    cardBadge: { fontSize: 15, color: '#000', fontWeight: '400' },
    heartCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', marginLeft: 'auto' },

    // --- FILTER MODAL ---
    filterOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    filterMenu: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 25, maxHeight: '85%' },
    filterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    filterMenuTitle: { fontSize: 26, fontWeight: '800' },
    filterSectionLabel: { fontSize: 12, fontWeight: '800', color: '#BBB', marginTop: 18, marginBottom: 12, textTransform: 'uppercase' },
    inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    customInput: { flex: 1, backgroundColor: '#F5F5F5', height: 50, borderRadius: 15, paddingHorizontal: 18, fontSize: 15, marginRight: 12, borderWidth: 1, borderColor: '#EEE' },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
    chip: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 25, backgroundColor: '#F5F5F5', marginRight: 10, marginBottom: 12, borderWidth: 1, borderColor: '#EEE' },
    chipSelected: { backgroundColor: '#000', borderColor: '#000' },
    chipText: { color: '#666', fontSize: 14, fontWeight: '600' },
    chipTextSelected: { color: '#FFFFFF' },
    applyBtn: { backgroundColor: '#000', borderRadius: 18, paddingVertical: 18, alignItems: 'center', marginTop: 30 },
    applyBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 18 },

    // --- MEAL DETAIL MODAL (EXPANDED) ---
    modalOverlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.92)' },
    absoluteHero: { position: 'absolute', top: 0, width: width, height: height * 0.45, opacity: 0.8 },
    modalContainer: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 25 },
    closeBtn: {
        position: 'absolute',
        top: 50,
        right: 25,
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        padding: 10,
        zIndex: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4
    },
    detailInfoBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        borderWidth: 4.5,
        borderColor: '#FF8A65',
        width: '94%',
        height: '78%',
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10
    },
    internalScrollView: { flex: 1 },
    innerScrollContent: {
        paddingTop: 24,
        paddingBottom: 50,
        paddingHorizontal: 22
    },
    detailHeaderSection: { flexDirection: 'row', marginBottom: 20 },
    detailThumb: { width: 120, height: 120, borderRadius: 18, backgroundColor: '#F0F0F0' },
    detailHeaderText: { flex: 1, marginLeft: 18, justifyContent: 'center' },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    detailTitle: { fontSize: 24, fontWeight: '900', color: '#1A1A1A', flex: 1, letterSpacing: -0.5 },
    detailHeartBtn: { padding: 4, marginLeft: 8 },
    detailSubText: { fontSize: 15, color: '#777', marginTop: 6, lineHeight: 20, fontWeight: '400' },
    detailMetaContainer: { flexDirection: 'row', marginTop: 15, gap: 15 },
    detailMetaValue: { fontSize: 15, color: '#333', marginLeft: 8, fontWeight: '600' },
    detailDivider: { height: 1.5, backgroundColor: '#F0F0F0', marginVertical: 20, width: '100%' },

    // Sections
    detailSection: { marginBottom: 30 },
    sectionHeading: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 16,
        letterSpacing: -0.3
    },

    // Ingredients List
    ingredientsList: { paddingLeft: 4 },
    ingredientRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
    bulletPoint: { fontSize: 18, color: '#FF8A65', marginRight: 10, fontWeight: 'bold' },
    ingredientText: { fontSize: 16, color: '#444', flex: 1, lineHeight: 22 },
    ingredientAmount: { fontWeight: '700', color: '#1A1A1A' },

    // Steps List
    stepsList: { gap: 18 },
    stepContainer: { flexDirection: 'row', alignItems: 'flex-start' },
    stepNumberCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FF8A65',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
        marginTop: 2
    },
    stepNumberText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
    stepContentText: { fontSize: 16, color: '#444', flex: 1, lineHeight: 24, fontWeight: '400' },
});

export default HomeScreen;
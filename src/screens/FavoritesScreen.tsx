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
    StatusBar,
} from 'react-native';
import {
    SlidersHorizontal,
    Search,
    Clock,
    Users,
    Heart,
    X,
    PlusCircle,
} from 'lucide-react-native';
import { collection, query, where, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Meal } from '../types/meal';
import MealCard from '../components/MealCard';
import AddToPlanModal from '../components/AddToPlanModal';

const { height, width } = Dimensions.get('window');

const FavoritesScreen = () => {
    const [allMeals, setAllMeals] = useState<Meal[]>([]);
    const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('healthy');
    const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Add-to-plan modal
    const [addToPlanMeal, setAddToPlanMeal] = useState<Meal | null>(null);
    const [isAddToPlanVisible, setIsAddToPlanVisible] = useState(false);

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

    const hasActiveFilters =
        filters.allergies.length > 0 || filters.dietary.length > 0 || filters.effort !== '';

    // ── Data fetching ──────────────────────────────────────────────────────────

    useEffect(() => {
        setLoading(true);
        const q = query(
            collection(db, 'meals'),
            where('favorited', '==', true),
            where('category', 'array-contains', activeCategory),
        );
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Meal[];
                setAllMeals(fetched);
                setLoading(false);
            },
            (error) => {
                console.error('Firebase Snapshot Error: ', error);
                setLoading(false);
            },
        );
        return () => unsubscribe();
    }, [activeCategory]);

    // Keep detail modal in sync if favorited meal gets unfavorited (removed from list)
    useEffect(() => {
        if (selectedMeal) {
            const updated = allMeals.find(m => m.id === selectedMeal.id);
            if (!updated) setSelectedMeal(null);
            else setSelectedMeal(updated);
        }
    }, [allMeals]);

    // Search + filter
    useEffect(() => {
        let results = [...allMeals];
        if (searchQuery.trim() !== '') {
            const q = searchQuery.toLowerCase();
            results = results.filter(
                m =>
                    m.name.toLowerCase().includes(q) ||
                    m.description.toLowerCase().includes(q),
            );
        }
        if (filters.allergies.length > 0) {
            results = results.filter(
                m => !m.dietaryPreferences?.some(p => filters.allergies.includes(p)),
            );
        }
        if (filters.dietary.length > 0) {
            results = results.filter(
                m => m.dietaryPreferences?.some(p => filters.dietary.includes(p)),
            );
        }
        if (filters.effort !== '') {
            results = results.filter(m => m.effortLevel === filters.effort);
        }
        setFilteredMeals(results);
    }, [searchQuery, allMeals, filters]);

    // ── Actions ───────────────────────────────────────────────────────────────

    const toggleFavorite = async (mealId: string) => {
        const meal = allMeals.find(m => m.id === mealId);
        if (!meal) return;
        try {
            await updateDoc(doc(db, 'meals', mealId), { favorited: !meal.favorited });
        } catch (error) {
            console.error('Firestore Update Failed: ', error);
        }
    };

    const toggleFilter = (type: 'allergies' | 'dietary', value: string) => {
        setFilters(prev => ({
            ...prev,
            [type]: prev[type].includes(value)
                ? prev[type].filter(i => i !== value)
                : [...prev[type], value],
        }));
    };

    const addCustomItem = (type: 'allergies' | 'dietary') => {
        const val = type === 'allergies' ? customAllergy : customDietary;
        if (val.trim() === '') return;
        if (!filters[type].includes(val.trim())) toggleFilter(type, val.trim());
        type === 'allergies' ? setCustomAllergy('') : setCustomDietary('');
    };

    const clearAllFilters = () => setFilters({ allergies: [], dietary: [], effort: '' });

    // ── Sub-components ────────────────────────────────────────────────────────

    const FilterChip = ({ label, isSelected, onPress, isRemovable }: any) => (
        <TouchableOpacity
            style={[styles.chip, isSelected && styles.chipSelected, isRemovable && styles.activePill]}
            onPress={onPress}
        >
            <Text style={[styles.chipText, (isSelected || isRemovable) && styles.chipTextSelected]}>
                {label}
            </Text>
            {isRemovable && <X size={14} color="#FFF" style={{ marginLeft: 6 }} />}
        </TouchableOpacity>
    );

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#68BB59" />
                </View>
            ) : (
                <FlatList
                    data={filteredMeals}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <MealCard
                            meal={item}
                            // Card body tap → open detail modal
                            onPress={() => setSelectedMeal(item)}
                            // Heart button → toggle favorite
                            onFavoritePress={() => toggleFavorite(item.id)}
                            // + button → open AddToPlanModal
                            onAddPress={() => {
                                setAddToPlanMeal(item);
                                setIsAddToPlanVisible(true);
                            }}
                        />
                    )}
                    ListHeaderComponent={
                        <View style={styles.stickyHeaderContent}>
                            <View style={styles.header}>
                                <Text style={styles.welcomeText}>Favorites</Text>
                                <Text style={styles.subText}>Your saved meal collection</Text>
                            </View>

                            <View style={styles.searchRow}>
                                <View style={styles.searchBar}>
                                    <Search size={20} color="#666" />
                                    <TextInput
                                        placeholder="Search Favorites"
                                        style={styles.searchInput}
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={[styles.filterBtn, hasActiveFilters && styles.filterBtnActive]}
                                    onPress={() => setIsFilterVisible(true)}
                                >
                                    <SlidersHorizontal size={22} color="#FFF" />
                                </TouchableOpacity>
                            </View>

                            {hasActiveFilters && (
                                <View style={styles.activeFiltersContainer}>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.activeFiltersScroll}
                                    >
                                        {filters.effort !== '' && (
                                            <FilterChip
                                                label={filters.effort}
                                                isRemovable
                                                onPress={() => setFilters(p => ({ ...p, effort: '' }))}
                                            />
                                        )}
                                        {filters.dietary.map(item => (
                                            <FilterChip
                                                key={item}
                                                label={item}
                                                isRemovable
                                                onPress={() => toggleFilter('dietary', item)}
                                            />
                                        ))}
                                        {filters.allergies.map(item => (
                                            <FilterChip
                                                key={item}
                                                label={`No ${item}`}
                                                isRemovable
                                                onPress={() => toggleFilter('allergies', item)}
                                            />
                                        ))}
                                    </ScrollView>
                                </View>
                            )}

                            <View style={styles.categoryRow}>
                                {categories.map(cat => (
                                    <TouchableOpacity
                                        key={cat.value}
                                        style={[
                                            styles.categoryBtn,
                                            activeCategory === cat.value && styles.categoryBtnActive,
                                        ]}
                                        onPress={() => setActiveCategory(cat.value)}
                                    >
                                        <Text
                                            style={[
                                                styles.categoryBtnText,
                                                activeCategory === cat.value && styles.categoryBtnTextActive,
                                            ]}
                                        >
                                            {cat.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    }
                    stickyHeaderIndices={[0]}
                    contentContainerStyle={styles.listBottomPadding}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Heart size={40} color="#DDD" />
                            <Text style={styles.emptyText}>No favorites in this category yet.</Text>
                        </View>
                    }
                />
            )}

            {/* ── Add-to-plan modal ────────────────────────────────────────────── */}
            <AddToPlanModal
                visible={isAddToPlanVisible}
                meal={addToPlanMeal}
                onClose={() => setIsAddToPlanVisible(false)}
            />

            {/* ── Filter modal ────────────────────────────────────────────────── */}
            <Modal visible={isFilterVisible} animationType="slide" transparent>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.filterOverlay}
                >
                    <View style={styles.filterMenu}>
                        <View style={styles.filterHeader}>
                            <Text style={styles.filterMenuTitle}>Filters</Text>
                            <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                                <X size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.filterSectionLabel}>Allergies (Exclude)</Text>
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={styles.customInput}
                                    placeholder="Add custom allergy..."
                                    value={customAllergy}
                                    onChangeText={setCustomAllergy}
                                />
                                <TouchableOpacity onPress={() => addCustomItem('allergies')}>
                                    <PlusCircle size={32} color="#000" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.chipRow}>
                                {predefinedAllergies.map(item => (
                                    <FilterChip
                                        key={item}
                                        label={item}
                                        isSelected={filters.allergies.includes(item)}
                                        onPress={() => toggleFilter('allergies', item)}
                                    />
                                ))}
                            </View>

                            <Text style={styles.filterSectionLabel}>Dietary Preferences</Text>
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={styles.customInput}
                                    placeholder="e.g. Vegan, Keto..."
                                    value={customDietary}
                                    onChangeText={setCustomDietary}
                                />
                                <TouchableOpacity onPress={() => addCustomItem('dietary')}>
                                    <PlusCircle size={32} color="#000" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.chipRow}>
                                {['Vegan', 'Vegetarian', 'Pescetarian', 'Paleo'].map(item => (
                                    <FilterChip
                                        key={item}
                                        label={item}
                                        isSelected={filters.dietary.includes(item)}
                                        onPress={() => toggleFilter('dietary', item)}
                                    />
                                ))}
                            </View>

                            <Text style={styles.filterSectionLabel}>Cooking Effort</Text>
                            <View style={styles.chipRow}>
                                {effortOptions.map(option => (
                                    <FilterChip
                                        key={option}
                                        label={option}
                                        isSelected={filters.effort === option}
                                        onPress={() =>
                                            setFilters(prev => ({
                                                ...prev,
                                                effort: prev.effort === option ? '' : option,
                                            }))
                                        }
                                    />
                                ))}
                            </View>
                        </ScrollView>

                        <View style={styles.filterFooterButtons}>
                            <TouchableOpacity style={styles.clearBtn} onPress={clearAllFilters}>
                                <Text style={styles.clearBtnText}>Clear All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.applyBtn}
                                onPress={() => setIsFilterVisible(false)}
                            >
                                <Text style={styles.applyBtnText}>Apply Filters</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* ── Detail modal ────────────────────────────────────────────────── */}
            <Modal visible={!!selectedMeal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <Image
                        source={{ uri: selectedMeal?.imageUrl }}
                        style={styles.absoluteHero}
                        blurRadius={2}
                    />
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedMeal(null)}>
                            <X size={28} color="#000" strokeWidth={2.5} />
                        </TouchableOpacity>

                        <View style={styles.detailInfoBox}>
                            <ScrollView
                                style={styles.internalScrollView}
                                contentContainerStyle={styles.innerScrollContent}
                                showsVerticalScrollIndicator
                            >
                                <View style={styles.detailHeaderSection}>
                                    <Image
                                        source={{ uri: selectedMeal?.imageUrl }}
                                        style={styles.detailThumb}
                                    />
                                    <View style={styles.detailHeaderText}>
                                        <View style={styles.titleRow}>
                                            <Text style={styles.detailTitle}>{selectedMeal?.name}</Text>
                                            <TouchableOpacity
                                                style={styles.detailHeartBtn}
                                                onPress={() => toggleFavorite(selectedMeal!.id)}
                                            >
                                                <Heart size={24} color="#FF0000" fill="#FF0000" />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.detailSubText}>{selectedMeal?.description}</Text>
                                        <View style={styles.detailMetaContainer}>
                                            <View style={styles.metaRow}>
                                                <Clock size={18} color="#FF8A65" />
                                                <Text style={styles.detailMetaValue}>
                                                    {selectedMeal?.timeMinutes} min
                                                </Text>
                                            </View>
                                            <View style={styles.metaRow}>
                                                <Users size={18} color="#FF8A65" />
                                                <Text style={styles.detailMetaValue}>
                                                    {selectedMeal?.servings} servings
                                                </Text>
                                            </View>
                                        </View>

                                        <Text style={styles.detailBadge}>
                                            {selectedMeal?.effortLevel}{'   |   '}{selectedMeal?.cost}
                                        </Text>

                                        {selectedMeal?.dietaryPreferences && selectedMeal.dietaryPreferences.length > 0 && (
                                            <View style={styles.detailPillsRow}>
                                                {selectedMeal.dietaryPreferences.map((pref) => (
                                                    <View key={pref} style={styles.detailPill}>
                                                        <Text style={styles.detailPillText}>{pref}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                </View>

                                <View style={styles.detailDivider} />

                                <View style={styles.detailSection}>
                                    <Text style={styles.sectionHeading}>Ingredients</Text>
                                    <View style={styles.ingredientsList}>
                                        {selectedMeal?.ingredients?.map((item, index) => (
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

                                <View style={styles.detailSection}>
                                    <Text style={styles.sectionHeading}>Instructions</Text>
                                    <View style={styles.stepsList}>
                                        {selectedMeal?.steps?.map((step, index) => (
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
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    stickyHeaderContent: { backgroundColor: '#FFFFFF', paddingBottom: 15, zIndex: 10 },
    header: { paddingHorizontal: 24, paddingTop: 10 },
    welcomeText: { fontSize: 26, fontWeight: '800', color: '#1A1A1A' },
    subText: { fontSize: 14, color: '#666', marginTop: 2 },
    searchRow: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 20 },
    searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8F8', borderRadius: 12, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: '#EEE', marginRight: 10 },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
    filterBtn: { backgroundColor: '#68BB59', width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    filterBtnActive: { backgroundColor: '#4a9a3c' },
    categoryRow: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 20, justifyContent: 'space-between' },
    categoryBtn: { width: '31%', paddingVertical: 12, borderRadius: 12, borderWidth: 2, borderColor: '#68BB59', alignItems: 'center', backgroundColor: '#FFF' },
    categoryBtnActive: { backgroundColor: '#68BB59' },
    categoryBtnText: { color: '#68BB59', fontWeight: '800', fontSize: 14 },
    categoryBtnTextActive: { color: '#FFFFFF' },
    activeFiltersContainer: { marginTop: 12, height: 40 },
    activeFiltersScroll: { paddingHorizontal: 20 },
    activePill: { backgroundColor: '#68BB59', borderRadius: 20, paddingHorizontal: 12, height: 32, marginRight: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    listBottomPadding: { paddingBottom: 40 },
    emptyContainer: { alignItems: 'center', marginTop: 60 },
    emptyText: { color: '#AAA', marginTop: 10, fontSize: 15 },
    metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
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
    filterFooterButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, gap: 10 },
    applyBtn: { flex: 2, backgroundColor: '#68BB59', borderRadius: 18, paddingVertical: 18, alignItems: 'center' },
    applyBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 18 },
    clearBtn: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 18, paddingVertical: 18, alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
    clearBtnText: { color: '#666', fontWeight: '800', fontSize: 16 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.92)' },
    absoluteHero: { position: 'absolute', top: 0, width: width, height: height * 0.45, opacity: 0.8 },
    modalContainer: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 25 },
    closeBtn: { position: 'absolute', top: 50, right: 25, backgroundColor: '#FFFFFF', borderRadius: 30, padding: 10, zIndex: 20 },
    detailInfoBox: { backgroundColor: '#FFFFFF', borderRadius: 25, borderWidth: 4.5, borderColor: '#FF8A65', width: '94%', height: '78%', overflow: 'hidden' },
    internalScrollView: { flex: 1 },
    innerScrollContent: { paddingTop: 24, paddingBottom: 50, paddingHorizontal: 22 },
    detailHeaderSection: { flexDirection: 'row', marginBottom: 20 },
    detailThumb: { width: 120, height: 120, borderRadius: 18, backgroundColor: '#F0F0F0' },
    detailHeaderText: { flex: 1, marginLeft: 18, justifyContent: 'center' },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    detailTitle: { fontSize: 24, fontWeight: '900', color: '#1A1A1A', flex: 1 },
    detailHeartBtn: { padding: 4, marginLeft: 8 },
    detailSubText: { fontSize: 15, color: '#777', marginTop: 6, lineHeight: 20 },
    detailMetaContainer: { flexDirection: 'row', marginTop: 15, gap: 15 },
    detailMetaValue: { fontSize: 15, color: '#333', marginLeft: 8, fontWeight: '600' },
    detailBadge: { fontSize: 13, color: '#555', fontWeight: '500', marginTop: 10 },
    detailPillsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 6 },
    detailPill: { backgroundColor: '#F0FAF0', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#68BB59' },
    detailPillText: { fontSize: 12, color: '#68BB59', fontWeight: '700' },
    detailDivider: { height: 1.5, backgroundColor: '#F0F0F0', marginVertical: 20 },
    detailSection: { marginBottom: 30 },
    sectionHeading: { fontSize: 20, fontWeight: '800', color: '#1A1A1A', marginBottom: 16 },
    ingredientsList: { paddingLeft: 4 },
    ingredientRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
    bulletPoint: { fontSize: 18, color: '#FF8A65', marginRight: 10 },
    ingredientText: { fontSize: 16, color: '#444', flex: 1 },
    ingredientAmount: { fontWeight: '700' },
    stepsList: { gap: 18 },
    stepContainer: { flexDirection: 'row', alignItems: 'flex-start' },
    stepNumberCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FF8A65', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    stepNumberText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
    stepContentText: { fontSize: 16, color: '#444', flex: 1, lineHeight: 24 },
});

export default FavoritesScreen;
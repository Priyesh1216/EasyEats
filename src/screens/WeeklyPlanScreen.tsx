import React, { useEffect, useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Modal,
    Dimensions,
} from 'react-native';
import {
    collection,
    getDocs,
    query,
    orderBy,
    deleteDoc,
    updateDoc,
    doc,
} from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { X, Clock, Users, Heart } from 'lucide-react-native';
import { db } from '../services/firebase';
import { Meal } from '../types/meal';
import MealCard from '../components/MealCard';
import AddToPlanModal from '../components/AddToPlanModal';
import HomeScreen from './HomeScreen';

const { height, width } = Dimensions.get('window');

type PlanEntry = { meal: Meal; planDocId: string };

const WeeklyPlanScreen = () => {
    const [planItems, setPlanItems] = useState<
        { date: string; display: string; entries: PlanEntry[] }[]
    >([]);
    const [loading, setLoading] = useState(true);

    // Add-to-plan flow
    const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
    const [isPlanModalVisible, setIsPlanModalVisible] = useState(false);
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [targetDate, setTargetDate] = useState<string | undefined>(undefined);

    // Remove confirm modal — stores the planDocId to delete if user says Yes
    const [removeConfirmVisible, setRemoveConfirmVisible] = useState(false);
    const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

    // Detail expand modal
    const [detailMeal, setDetailMeal] = useState<Meal | null>(null);

    const formatDate = (isoString: string) => {
        const [year, month, day] = isoString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const fetchWeeklyPlan = async () => {
        setLoading(true);
        try {
            const planSnapshot = await getDocs(
                query(collection(db, 'weeklyPlan'), orderBy('date', 'asc')),
            );
            const planData = planSnapshot.docs.map((d) => ({
                planDocId: d.id,
                ...(d.data() as { mealId: string; date: string }),
            }));

            const mealsSnapshot = await getDocs(collection(db, 'meals'));
            const mealsLookup = mealsSnapshot.docs.reduce(
                (acc, d) => {
                    acc[d.id] = { id: d.id, ...d.data() } as Meal;
                    return acc;
                },
                {} as { [key: string]: Meal },
            );

            const grouped: { [key: string]: PlanEntry[] } = {};
            planData.forEach(({ planDocId, mealId, date }) => {
                const fullMeal = mealsLookup[mealId];
                if (fullMeal) {
                    if (!grouped[date]) grouped[date] = [];
                    grouped[date].push({ meal: fullMeal, planDocId });
                }
            });

            setPlanItems(
                Object.keys(grouped)
                    .sort()
                    .map((date) => ({
                        date,
                        display: formatDate(date),
                        entries: grouped[date],
                    })),
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchWeeklyPlan();
        }, []),
    );

    // Step 1: − button pressed → show confirm modal
    const handleRemoveBtnPress = (planDocId: string) => {
        setPendingRemoveId(planDocId);
        setRemoveConfirmVisible(true);
    };

    // Step 2: User tapped "Yes" in the confirm modal
    const handleConfirmRemove = async () => {
        if (!pendingRemoveId) return;
        setRemoveConfirmVisible(false);
        try {
            await deleteDoc(doc(db, 'weeklyPlan', pendingRemoveId));
            setPlanItems((prev) =>
                prev
                    .map((group) => ({
                        ...group,
                        entries: group.entries.filter((e) => e.planDocId !== pendingRemoveId),
                    }))
                    .filter((group) => group.entries.length > 0),
            );
        } catch (error) {
            console.error(error);
        } finally {
            setPendingRemoveId(null);
        }
    };

    // Step 2 alt: User tapped "No"
    const handleCancelRemove = () => {
        setRemoveConfirmVisible(false);
        setPendingRemoveId(null);
    };

    // Toggle favorite in Firestore + local state
    const handleToggleFavorite = async (meal: Meal) => {
        try {
            await updateDoc(doc(db, 'meals', meal.id), { favorited: !meal.favorited });
            setPlanItems((prev) =>
                prev.map((group) => ({
                    ...group,
                    entries: group.entries.map((e) =>
                        e.meal.id === meal.id
                            ? { ...e, meal: { ...e.meal, favorited: !e.meal.favorited } }
                            : e,
                    ),
                })),
            );
            if (detailMeal?.id === meal.id) {
                setDetailMeal((d) => d ? { ...d, favorited: !d.favorited } : d);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenEmptyModal = (date: string) => {
        setTargetDate(date);
        setSelectedMeal(null);
        setIsPlanModalVisible(true);
    };

    const handleMealPicked = (meal: Meal) => {
        setSelectedMeal(meal);
        setIsPickerVisible(false);
        setIsPlanModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Weekly Planner</Text>
                    <Text style={styles.subtitle}>Plan your meals for the week</Text>
                </View>
                <Image
                    source={require('../../assets/custom_logo.png')}
                    style={styles.headerLogo}
                />
            </View>

            {/* Plan list */}
            {loading ? (
                <ActivityIndicator size="large" color="#68BB59" style={{ flex: 1 }} />
            ) : (
                <ScrollView contentContainerStyle={styles.scroll}>
                    {planItems.map((group) => (
                        <View key={group.date}>
                            <View style={styles.dayHeader}>
                                <Text style={styles.dayLabel}>{group.display}</Text>
                                <TouchableOpacity
                                    style={styles.addBtn}
                                    onPress={() => handleOpenEmptyModal(group.date)}
                                >
                                    <Text style={styles.addBtnText}>ADD MEAL +</Text>
                                </TouchableOpacity>
                            </View>

                            {group.entries.map(({ meal, planDocId }) => (
                                <MealCard
                                    key={planDocId}
                                    meal={meal}
                                    showRemove
                                    onPress={() => setDetailMeal(meal)}
                                    onRemovePress={() => handleRemoveBtnPress(planDocId)}
                                    onFavoritePress={() => handleToggleFavorite(meal)}
                                />
                            ))}
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* ── Meal picker modal (HomeScreen in picker mode) ──────────── */}
            <Modal visible={isPickerVisible} animationType="slide">
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.pickerHeader}>
                        <Text style={styles.pickerTitle}>Select a Meal</Text>
                        <TouchableOpacity onPress={() => setIsPickerVisible(false)}>
                            <X size={28} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <HomeScreen isPickerMode={true} onMealSelect={handleMealPicked} />
                </SafeAreaView>
            </Modal>

            {/* ── Add-to-plan modal ───────────────────────────────────────── */}
            <AddToPlanModal
                visible={isPlanModalVisible}
                meal={selectedMeal}
                initialDate={targetDate}
                onClose={() => {
                    setIsPlanModalVisible(false);
                    fetchWeeklyPlan();
                }}
                onChooseMeal={() => {
                    setIsPlanModalVisible(false);
                    setIsPickerVisible(true);
                }}
            />

            {/* ── Remove confirm modal ────────────────────────────────────── */}
            <Modal visible={removeConfirmVisible} transparent animationType="fade">
                <View style={styles.confirmOverlay}>
                    <View style={styles.confirmBox}>
                        <Text style={styles.confirmTitle}>Remove Meal</Text>
                        <Text style={styles.confirmMessage}>
                            Are you sure you want to remove this meal from your weekly plan?
                        </Text>
                        <View style={styles.confirmButtons}>
                            <TouchableOpacity
                                style={styles.confirmNoBtn}
                                onPress={handleCancelRemove}
                            >
                                <Text style={styles.confirmNoBtnText}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.confirmYesBtn}
                                onPress={handleConfirmRemove}
                            >
                                <Text style={styles.confirmYesBtnText}>Yes, Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* ── Detail expand modal ─────────────────────────────────────── */}
            <Modal visible={!!detailMeal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <Image
                        source={{ uri: detailMeal?.imageUrl }}
                        style={styles.absoluteHero}
                        blurRadius={2}
                    />
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setDetailMeal(null)}>
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
                                        source={{ uri: detailMeal?.imageUrl }}
                                        style={styles.detailThumb}
                                    />
                                    <View style={styles.detailHeaderText}>
                                        <View style={styles.titleRow}>
                                            <Text style={styles.detailTitle}>{detailMeal?.name}</Text>
                                            <TouchableOpacity
                                                style={styles.detailHeartBtn}
                                                onPress={() => detailMeal && handleToggleFavorite(detailMeal)}
                                            >
                                                <Heart
                                                    size={24}
                                                    color={detailMeal?.favorited ? '#FF0000' : '#D1D1D1'}
                                                    fill={detailMeal?.favorited ? '#FF0000' : 'none'}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.detailSubText}>{detailMeal?.description}</Text>
                                        <View style={styles.detailMetaContainer}>
                                            <View style={styles.detailMetaRow}>
                                                <Clock size={18} color="#FF8A65" />
                                                <Text style={styles.detailMetaValue}>{detailMeal?.timeMinutes} min</Text>
                                            </View>
                                            <View style={styles.detailMetaRow}>
                                                <Users size={18} color="#FF8A65" />
                                                <Text style={styles.detailMetaValue}>{detailMeal?.servings} servings</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.detailBadge}>
                                            {detailMeal?.effortLevel}{'   |   '}{detailMeal?.cost}
                                        </Text>
                                        {detailMeal?.dietaryPreferences && detailMeal.dietaryPreferences.length > 0 && (
                                            <View style={styles.detailPillsRow}>
                                                {detailMeal.dietaryPreferences.map((pref) => (
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
                                        {detailMeal?.ingredients?.map((item, index) => (
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
                                        {detailMeal?.steps?.map((step, index) => (
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
    container: { flex: 1, backgroundColor: '#FFF' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 25,
        marginTop: 20,
    },
    title: { fontSize: 28, fontWeight: 'bold' },
    subtitle: { color: '#666', fontSize: 14 },
    headerLogo: { width: 45, height: 45, resizeMode: 'contain' },
    scroll: { paddingHorizontal: 25, paddingBottom: 30 },
    dayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 35,
        marginBottom: 15,
    },
    dayLabel: { fontSize: 16, fontWeight: '700' },
    addBtn: {
        backgroundColor: '#C8E6C9',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addBtnText: { color: '#2E7D32', fontSize: 12, fontWeight: 'bold' },
    pickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    pickerTitle: { fontSize: 20, fontWeight: 'bold' },
    // ── Remove confirm modal ──────────────────────────────────────────
    confirmOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmBox: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 28,
        width: '80%',
        alignItems: 'center',
    },
    confirmTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 12,
    },
    confirmMessage: {
        fontSize: 15,
        color: '#555',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    confirmButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    confirmNoBtn: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    confirmNoBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#555',
    },
    confirmYesBtn: {
        flex: 1,
        backgroundColor: '#FF5252',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
    },
    confirmYesBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
    },
    // ── Detail modal ──────────────────────────────────────────────────
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
    detailMetaRow: { flexDirection: 'row', alignItems: 'center' },
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

export default WeeklyPlanScreen;
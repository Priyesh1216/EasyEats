import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  SlidersHorizontal,
  Search as SearchIcon,
  RotateCw,
  Clock,
  Users,
  Heart,
  X,
} from 'lucide-react-native';
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { Meal, Category } from '../types/meal';
import MealCard from '../components/MealCard';
import AddToPlanModal from '../components/AddToPlanModal';

const { height, width } = Dimensions.get('window');

interface HomeScreenProps {
  isPickerMode?: boolean;
  onMealSelect?: (meal: Meal) => void;
}

const HomeScreen = ({ isPickerMode, onMealSelect }: HomeScreenProps) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('healthy');

  // Detail modal
  const [detailMeal, setDetailMeal] = useState<Meal | null>(null);

  // Add-to-plan modal
  const [addToPlanMeal, setAddToPlanMeal] = useState<Meal | null>(null);
  const [isAddToPlanVisible, setIsAddToPlanVisible] = useState(false);

  const categories: { label: string; value: Category }[] = [
    { label: 'Healthy', value: 'healthy' },
    { label: 'Quick', value: 'quick' },
    { label: 'Budget', value: 'budget' },
  ];

  const fetchMeals = async (category: Category) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'meals'),
        where('category', 'array-contains', category),
      );
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Meal,
      );
      setMeals(fetched.sort(() => Math.random() - 0.5).slice(0, 4));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals(activeCategory);
  }, [activeCategory]);

  // Card body tap
  const handleCardPress = (meal: Meal) => {
    if (isPickerMode && onMealSelect) {
      onMealSelect(meal);
    } else {
      setDetailMeal(meal);
    }
  };

  // + button tap
  const handleAddPress = (meal: Meal) => {
    if (isPickerMode && onMealSelect) {
      onMealSelect(meal);
    } else {
      setAddToPlanMeal(meal);
      setIsAddToPlanVisible(true);
    }
  };

  // Heart button
  const handleToggleFavorite = async (meal: Meal) => {
    try {
      await updateDoc(doc(db, 'meals', meal.id), { favorited: !meal.favorited });
      setMeals((prev) =>
        prev.map((m) => m.id === meal.id ? { ...m, favorited: !m.favorited } : m),
      );
      // Keep detail modal in sync
      if (detailMeal?.id === meal.id) {
        setDetailMeal((d) => d ? { ...d, favorited: !d.favorited } : d);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {!isPickerMode && (
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
      )}

      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <SearchIcon size={20} color="#666" />
          <TextInput placeholder="Search Meals" style={styles.searchInput} />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <SlidersHorizontal size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.categoryRow}>
        {categories.map((cat) => (
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

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#68BB59"
          style={{ flex: 1, marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MealCard
              meal={item}
              onPress={() => handleCardPress(item)}
              onAddPress={() => handleAddPress(item)}
              onFavoritePress={() => handleToggleFavorite(item)}
            />
          )}
          contentContainerStyle={styles.list}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.generateBtn}
              onPress={() => fetchMeals(activeCategory)}
            >
              <RotateCw size={18} color="#FF8A65" style={{ marginRight: 8 }} />
              <Text style={styles.generateBtnText}>Generate New Meals</Text>
            </TouchableOpacity>
          }
        />
      )}

      {/* ── Add-to-plan modal ───────────────────────────────────────── */}
      {!isPickerMode && (
        <AddToPlanModal
          visible={isAddToPlanVisible}
          meal={addToPlanMeal}
          onClose={() => setIsAddToPlanVisible(false)}
        />
      )}

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 10,
  },
  welcomeText: { fontSize: 26, fontWeight: '800' },
  subText: { fontSize: 14, color: '#666' },
  headerLogo: { width: 50, height: 50, resizeMode: 'contain' },
  searchRow: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 25 },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 10,
  },
  searchInput: { flex: 1, marginLeft: 10 },
  filterBtn: {
    backgroundColor: '#7BC67E',
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 25,
    justifyContent: 'space-between',
  },
  categoryBtn: {
    width: '30%',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#68BB59',
    alignItems: 'center',
  },
  categoryBtnActive: { backgroundColor: '#68BB59' },
  categoryBtnText: { color: '#68BB59', fontWeight: 'bold' },
  categoryBtnTextActive: { color: '#FFFFFF' },
  list: { paddingHorizontal: 20, marginTop: 20 },
  generateBtn: {
    flexDirection: 'row',
    paddingVertical: 10,
    width: '65%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  generateBtnText: { color: '#FF8A65', fontWeight: '700' },
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

export default HomeScreen;
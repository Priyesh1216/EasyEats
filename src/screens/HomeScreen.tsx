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
} from 'react-native';
import {
  SlidersHorizontal,
  Search as SearchIcon,
  RotateCw,
} from 'lucide-react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Meal, Category } from '../types/meal';
import MealCard from '../components/MealCard';
import AddToPlanModal from '../components/AddToPlanModal';

interface HomeScreenProps {
  isPickerMode?: boolean;
  onMealSelect?: (meal: Meal) => void;
}

const HomeScreen = ({ isPickerMode, onMealSelect }: HomeScreenProps) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('healthy');
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        (doc) => ({ id: doc.id, ...doc.data() }) as Meal,
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

  const handleMealPress = (meal: Meal) => {
    if (isPickerMode && onMealSelect) {
      onMealSelect(meal);
    } else {
      setSelectedMeal(meal);
      setIsModalVisible(true);
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
            <MealCard meal={item} onAddPress={() => handleMealPress(item)} />
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

      {!isPickerMode && (
        <AddToPlanModal
          visible={isModalVisible}
          meal={selectedMeal}
          onClose={() => setIsModalVisible(false)}
        />
      )}
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
});

export default HomeScreen;

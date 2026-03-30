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
} from 'react-native';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { X } from 'lucide-react-native';
import { db } from '../services/firebase';
import { Meal } from '../types/meal';
import MealCard from '../components/MealCard';
import AddToPlanModal from '../components/AddToPlanModal';
import HomeScreen from './HomeScreen';

const WeeklyPlanScreen = () => {
  const [planItems, setPlanItems] = useState<
    { date: string; display: string; meals: Meal[] }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isPlanModalVisible, setIsPlanModalVisible] = useState(false);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [targetDate, setTargetDate] = useState<string | undefined>(undefined);

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
      const planData = planSnapshot.docs.map((doc) => doc.data());
      const mealsSnapshot = await getDocs(collection(db, 'meals'));
      const mealsLookup = mealsSnapshot.docs.reduce(
        (acc, doc) => {
          acc[doc.id] = { id: doc.id, ...doc.data() } as Meal;
          return acc;
        },
        {} as { [key: string]: Meal },
      );

      const grouped: { [key: string]: Meal[] } = {};
      planData.forEach((item) => {
        const fullMeal = mealsLookup[item.mealId];
        if (fullMeal) {
          if (!grouped[item.date]) grouped[item.date] = [];
          grouped[item.date].push(fullMeal);
        }
      });
      setPlanItems(
        Object.keys(grouped)
          .sort()
          .map((date) => ({
            date,
            display: formatDate(date),
            meals: grouped[date],
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
              {group.meals.map((meal, idx) => (
                <MealCard
                  key={`${group.date}-${idx}`}
                  meal={meal}
                  onAddPress={() => {
                    setSelectedMeal(meal);
                    setTargetDate(group.date);
                    setIsPlanModalVisible(true);
                  }}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      )}

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
});

export default WeeklyPlanScreen;

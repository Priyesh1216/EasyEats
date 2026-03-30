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
} from 'react-native';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../services/firebase';
import { Meal } from '../types/meal';
import MealCard from '../components/MealCard';

const WeeklyPlanScreen = () => {
  const [planItems, setPlanItems] = useState<
    { date: string; display: string; meals: Meal[] }[]
  >([]);
  const [loading, setLoading] = useState(true);

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
      const planData = planSnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as any,
      );

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
        const fullMealDetails = mealsLookup[item.mealId];
        if (fullMealDetails) {
          if (!grouped[item.date]) grouped[item.date] = [];
          grouped[item.date].push(fullMealDetails);
        }
      });

      const sortedPlan = Object.keys(grouped)
        .sort()
        .map((date) => ({
          date,
          display: formatDate(date),
          meals: grouped[date],
        }));

      setPlanItems(sortedPlan);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Weekly Planner</Text>
          <Text style={styles.subtitle}>
            Plan your meals for the week, your way
          </Text>
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
          {planItems.length > 0 ? (
            planItems.map((group) => (
              <View key={group.date}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayLabel}>{group.display}</Text>
                  <TouchableOpacity style={styles.addBtn}>
                    <Text style={styles.addBtnText}>ADD MEAL +</Text>
                  </TouchableOpacity>
                </View>
                {group.meals.map((meal, index) => (
                  <MealCard
                    key={`${group.date}-${index}-${meal.id}`}
                    meal={meal}
                  />
                ))}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyPlaceholder}>
                <Text style={styles.placeholderText}>No meals planned yet</Text>
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
  headerLogo: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  scroll: {
    paddingHorizontal: 25,
    paddingBottom: 30,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 35,
    marginBottom: 15,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  addBtn: {
    backgroundColor: '#C8E6C9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyPlaceholder: {
    height: 60,
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
});

export default WeeklyPlanScreen;

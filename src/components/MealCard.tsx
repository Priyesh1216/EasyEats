import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Clock, Users, Heart, Plus } from 'lucide-react-native';
import { Meal } from '../types/meal';

interface MealCardProps {
  meal: Meal;
  onPress?: () => void;
  onAddPress?: () => void;
  onFavoritePress?: () => void;
}

export const MealCard = ({
  meal,
  onPress,
  onAddPress,
  onFavoritePress,
}: MealCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.cardContainer}
    >
      <View style={styles.card}>
        <Image source={{ uri: meal.imageUrl }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{meal.name}</Text>
            <TouchableOpacity style={styles.plusBtn} onPress={onAddPress}>
              <Plus size={20} color="#000" strokeWidth={3} />
            </TouchableOpacity>
          </View>

          <Text style={styles.cardDescription} numberOfLines={1}>
            {meal.description}
          </Text>

          <View style={styles.cardMeta}>
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
            <Text style={styles.cardBadge}>{meal.effortLevel}</Text>
            <span style={styles.cardSeparator}>|</span>
            <Text style={styles.cardBadge}>{meal.cost}</Text>

            {meal.dietaryPreferences.length > 0 && (
              <>
                <Text style={styles.cardSeparator}>|</Text>
                <Text style={styles.cardBadge}>
                  {meal.dietaryPreferences[0]}
                </Text>
              </>
            )}

            <TouchableOpacity
              style={{ marginLeft: 'auto' }}
              onPress={onFavoritePress}
            >
              <Heart
                size={22}
                color={meal.favorited ? '#FF4444' : '#D1D1D1'}
                fill={meal.favorited ? '#FF4444' : 'none'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 3,
    borderColor: '#68BB59',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 8,
  },
  cardImage: {
    width: 95,
    height: 95,
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    flex: 1,
    marginRight: 5,
  },
  plusBtn: {
    backgroundColor: '#E8E8E8',
    borderRadius: 6,
    padding: 2,
  },
  cardDescription: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  cardMeta: {
    flexDirection: 'column',
    marginTop: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardMetaText: {
    fontSize: 13,
    color: '#444',
    marginLeft: 8,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  cardBadge: {
    fontSize: 13,
    color: '#666',
  },
  cardSeparator: {
    marginHorizontal: 8,
    color: '#DDD',
  },
});

export default MealCard;

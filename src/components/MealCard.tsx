import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';
import { Clock, Users, Heart, Plus } from 'lucide-react-native';

export interface Ingredient {
    name: string;
    amount: string;
}

export interface Meal {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    timeMinutes: number;
    servings: number;
    effortLevel: string;
    cost: string;
    favorited: boolean;
    category?: string[];
    dietaryPreferences?: string[];
    ingredients?: Ingredient[];
    steps?: string[];
}

interface MealCardProps {
    meal: Meal;
    onPress: (meal: Meal) => void;
    onToggleFavorite: (mealId: string) => void;
    onAdd?: (meal: Meal) => void;
}

const MealCard: React.FC<MealCardProps> = ({
    meal,
    onPress,
    onToggleFavorite,
    onAdd,
}) => {
    const heartColor = meal.favorited ? '#FF0000' : '#999';
    const heartFill = meal.favorited ? '#FF0000' : 'transparent';

    // Builds: "Medium   |   $   |   Vegan   |   Vegetarian"
    const footerParts = [meal.effortLevel, meal.cost, ...(meal.dietaryPreferences ?? [])];
    const footerLabel = footerParts.join('   |   ');

    return (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => onPress(meal)}
            activeOpacity={0.85}
        >
            <Image source={{ uri: meal.imageUrl }} style={styles.cardImage} />

            <View style={styles.cardContent}>
                {/* Header row: title + add button */}
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                        {meal.name}
                    </Text>
                    {onAdd && (
                        <TouchableOpacity
                            style={styles.plusBtn}
                            onPress={() => onAdd(meal)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Plus size={18} color="#000" strokeWidth={3} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Description */}
                <Text style={styles.cardDescription} numberOfLines={1}>
                    {meal.description}
                </Text>

                {/* Time & servings */}
                <View style={styles.cardMetaStack}>
                    <View style={styles.metaRow}>
                        <Clock size={14} color="#FF8A65" />
                        <Text style={styles.cardMetaText}>{meal.timeMinutes} min</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Users size={14} color="#FF8A65" />
                        <Text style={styles.cardMetaText}>{meal.servings} servings</Text>
                    </View>
                </View>

                {/* Footer: effort | cost | dietary prefs  +  heart */}
                <View style={styles.cardFooter}>
                    <Text style={styles.cardBadge} numberOfLines={1} adjustsFontSizeToFit>
                        {footerLabel}
                    </Text>
                    <TouchableOpacity
                        style={styles.heartCircle}
                        onPress={() => onToggleFavorite(meal.id)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Heart size={20} color={heartColor} fill={heartFill} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 18,
        marginHorizontal: 20,
        marginTop: 15,
        padding: 10,
        borderWidth: 2.5,
        borderColor: '#68BB59',
        alignItems: 'center',
    },
    cardImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
        backgroundColor: '#F0F0F0',
    },
    cardContent: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111',
        flex: 1,
    },
    plusBtn: {
        backgroundColor: '#EFEFEF',
        borderRadius: 8,
        padding: 5,
        marginLeft: 8,
    },
    cardDescription: {
        fontSize: 13,
        color: '#777',
        marginTop: 3,
    },
    cardMetaStack: {
        marginTop: 6,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
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
        justifyContent: 'space-between',
        marginTop: 6,
    },
    cardBadge: {
        fontSize: 13,
        color: '#555',
        fontWeight: '500',
        flex: 1,
        marginRight: 8,
    },
    heartCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#F2F2F2',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MealCard;
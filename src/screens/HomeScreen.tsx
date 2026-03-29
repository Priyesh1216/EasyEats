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
import { SlidersHorizontal, Search, Clock, Users, Heart, Plus, RotateCw } from 'lucide-react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Meal, Category } from '../types/meal';

const HomeScreen = () => {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<Category>('healthy');

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
                where('category', 'array-contains', category)
            );
            const snapshot = await getDocs(q);
            const fetched = snapshot.docs.map(doc => doc.data() as Meal);
            const shuffled = fetched.sort(() => Math.random() - 0.5).slice(0, 4);
            setMeals(shuffled);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeals(activeCategory);
    }, [activeCategory]);

    const MealCard = ({ meal }: { meal: Meal }) => (
        <View style={styles.cardContainer}>
            <View style={styles.card}>
                <Image source={{ uri: meal.imageUrl }} style={styles.cardImage} />
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{meal.name}</Text>
                        <TouchableOpacity style={styles.plusBtn}>
                            <Plus size={20} color="#000" strokeWidth={3} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.cardDescription} numberOfLines={1}>{meal.description}</Text>

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
                        <Text style={styles.cardSeparator}>|</Text>
                        <Text style={styles.cardBadge}>{meal.cost}</Text>
                        {meal.dietaryPreferences.length > 0 && (
                            <>
                                <Text style={styles.cardSeparator}>|</Text>
                                <Text style={styles.cardBadge}>{meal.dietaryPreferences[0]}</Text>
                            </>
                        )}
                        <TouchableOpacity style={{ marginLeft: 'auto' }}>
                            <Heart
                                size={22}
                                color={meal.favorited ? '#FF4444' : '#D1D1D1'}
                                fill={meal.favorited ? '#FF4444' : 'none'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
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

            <View style={styles.searchRow}>
                <View style={styles.searchBar}>
                    <Search size={20} color="#666" />
                    <TextInput
                        placeholder="Search Meals or Ingredients"
                        placeholderTextColor="#999"
                        style={styles.searchInput}
                    />
                </View>
                <TouchableOpacity style={styles.filterBtn}>
                    <SlidersHorizontal size={22} color="#FFF" />
                </TouchableOpacity>
            </View>

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
                        <Text style={[
                            styles.categoryBtnText,
                            activeCategory === cat.value && styles.categoryBtnTextActive,
                        ]}>
                            {cat.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.sectionTitle}>Suggested Meals</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#68BB59" style={{ flex: 1 }} />
            ) : (
                <FlatList
                    data={meals}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <MealCard meal={item} />}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginTop: 10,
    },
    welcomeText: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1A1A1A',
    },
    subText: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    headerLogo: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    searchRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 25,
    },
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
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
    },
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
    categoryBtnActive: {
        backgroundColor: '#68BB59',
    },
    categoryBtnText: {
        color: '#68BB59',
        fontWeight: 'bold',
        fontSize: 15,
    },
    categoryBtnTextActive: {
        color: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        paddingHorizontal: 20,
        marginTop: 30,
        marginBottom: 15,
        color: '#333',
    },
    list: {
        paddingHorizontal: 20,
    },
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
    generateBtn: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderWidth: 1.5,
        borderColor: '#666',
        borderRadius: 12,
        paddingVertical: 10,
        width: '65%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    generateBtnText: {
        color: '#FF8A65',
        fontWeight: '700',
        fontSize: 14,
    },
});

export default HomeScreen;
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  SectionList,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface GroceryItem {
  id: string;
  name: string;
  completed: boolean;
}

interface Section {
  title: string;
  data: GroceryItem[];
}

const GroceryListScreen = () => {
  const [sections, setSections] = useState<Section[]>([
    {
      title: 'PRODUCE',
      data: [
        { id: '1', name: '1 Avocado (large)', completed: false },
        { id: '2', name: '1 Cucumber', completed: false },
        { id: '3', name: '2 Red Bell Peppers', completed: false },
      ],
    },
    {
      title: 'PROTEIN',
      data: [
        { id: '4', name: '1 lb Chicken Breast (boneless)', completed: true },
      ],
    },
    {
      title: 'PANTRY',
      data: [
        { id: '5', name: '1 box Penne Pasta', completed: false },
        { id: '6', name: '1 can Chickpeas', completed: false },
        { id: '7', name: '1 bottle Olive Oil', completed: false },
      ],
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('PRODUCE');

  const categories = ['PRODUCE', 'PROTEIN', 'PANTRY'];

  const toggleItem = (id: string) => {
    setSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        data: section.data.map((item) =>
          item.id === id ? { ...item, completed: !item.completed } : item,
        ),
      })),
    );
  };

  const deleteItem = (id: string) => {
    setSections((prevSections) =>
      prevSections
        .map((section) => ({
          ...section,
          data: section.data.filter((item) => item.id !== id),
        }))
        .filter((section) => section.data.length > 0),
    );
  };

  const addItem = () => {
    if (newItemName.trim() === '') return;

    const newItem: GroceryItem = {
      id: Date.now().toString(),
      name: newItemName,
      completed: false,
    };

    setSections((prevSections) => {
      const sectionExists = prevSections.find(
        (s) => s.title === selectedCategory,
      );
      if (sectionExists) {
        return prevSections.map((section) =>
          section.title === selectedCategory
            ? { ...section, data: [...section.data, newItem] }
            : section,
        );
      } else {
        return [...prevSections, { title: selectedCategory, data: [newItem] }];
      }
    });

    setNewItemName('');
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: GroceryItem }) => (
    <TouchableOpacity
      style={[styles.itemCard, item.completed && styles.itemCardCompleted]}
      onPress={() => toggleItem(item.id)}
    >
      <View style={styles.itemLeft}>
        <MaterialCommunityIcons
          name={item.completed ? 'check-circle-outline' : 'circle-outline'}
          size={24}
          color={item.completed ? '#2E7D32' : '#FF8A65'}
        />
        <Text
          style={[styles.itemText, item.completed && styles.itemTextCompleted]}
        >
          {item.name}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => deleteItem(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialCommunityIcons name="close" size={20} color="#000" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Grocery List</Text>
          <Text style={styles.subtitle}>Manage your shopping list</Text>
        </View>
        <Image
          source={require('../../assets/custom_logo.png')}
          style={styles.headerLogo}
        />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={styles.listPadding}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyNote}>Your list is empty.</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.addBtnText}>Add Item</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Item</Text>

            <TextInput
              style={styles.input}
              placeholder="Item name (e.g. 2 Apples)"
              value={newItemName}
              onChangeText={setNewItemName}
              autoFocus
            />

            <Text style={styles.label}>Select Category:</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    selectedCategory === cat && styles.categoryChipSelected,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === cat &&
                        styles.categoryChipTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={addItem}
              >
                <Text style={styles.saveBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    paddingHorizontal: 25,
    marginTop: 20,
    marginBottom: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    color: '#666666',
    fontSize: 14,
    marginTop: 4,
  },
  headerLogo: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  listPadding: {
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginTop: 25,
    marginBottom: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  itemCardCompleted: {
    backgroundColor: '#E8F5E9',
    borderColor: '#81C784',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#000',
  },
  itemTextCompleted: {
    color: '#000',
  },
  emptyContainer: {
    paddingTop: 100,
    alignItems: 'center',
  },
  emptyNote: {
    color: '#999999',
    fontSize: 14,
  },
  addBtn: {
    backgroundColor: '#5CB85C',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 25,
    marginBottom: 25,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 25,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: '#DDD',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryChipSelected: {
    backgroundColor: '#5CB85C',
    borderColor: '#5CB85C',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#666',
  },
  categoryChipTextSelected: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginLeft: 10,
  },
  cancelBtn: {
    backgroundColor: '#F5F5F5',
  },
  saveBtn: {
    backgroundColor: '#5CB85C',
  },
  cancelBtnText: {
    color: '#333',
    fontWeight: '600',
  },
  saveBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default GroceryListScreen;

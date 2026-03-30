import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Calendar, Search, X, Check } from 'lucide-react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Meal } from '../types/meal';

interface AddToPlanModalProps {
  visible: boolean;
  meal: Meal | null;
  onClose: () => void;
}

const AddToPlanModal = ({ visible, meal, onClose }: AddToPlanModalProps) => {
  const [adding, setAdding] = useState(false);
  const [dateValue, setDateValue] = useState(
    new Date().toISOString().split('T')[0],
  );

  if (!meal) return null;

  const formatDate = (isoString: string) => {
    const [year, month, day] = isoString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleAddMeal = async () => {
    setAdding(true);
    try {
      await addDoc(collection(db, 'weeklyPlan'), {
        mealId: meal.id,
        mealName: meal.name,
        date: dateValue,
        createdAt: serverTimestamp(),
      });
      onClose();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not add meal to plan.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.modalContent}>
          <Text style={styles.title}>Add Meal to Weekly Plan</Text>

          <View style={styles.row}>
            <Calendar size={24} color="#000" />
            <View style={styles.inputField}>
              <Text style={styles.inputText}>{formatDate(dateValue)}</Text>
              <Calendar size={18} color="#000" />
              <input
                type="date"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0,
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer',
                }}
              />
            </View>
          </View>

          <View style={styles.row}>
            <Search size={24} color="#000" />
            <View style={styles.inputField}>
              <Text style={styles.inputText}>{meal.name}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <X size={24} color="#000" />
            <TouchableOpacity
              style={styles.button}
              onPress={onClose}
              disabled={adding}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <Check size={24} color="#000" />
            <TouchableOpacity
              style={styles.button}
              onPress={handleAddMeal}
              disabled={adding}
            >
              {adding ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.buttonText}>Add</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#D9D9D9',
    width: Platform.OS === 'web' ? 400 : '85%',
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputField: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginLeft: 15,
    paddingHorizontal: 15,
    height: 40,
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    backgroundColor: '#FFF',
    marginLeft: 15,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 15,
    color: '#000',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
});

export default AddToPlanModal;

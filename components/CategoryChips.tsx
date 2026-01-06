import { Coffee, Fuel, Hotel, ShoppingBasket, Stethoscope, Utensils } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/theme';

const categories = [
  { id: 'restaurants', label: 'Restaurants', icon: Utensils },
  { id: 'gas', label: 'Gas', icon: Fuel },
  { id: 'coffee', label: 'Coffee', icon: Coffee },
  { id: 'groceries', label: 'Groceries', icon: ShoppingBasket },
  { id: 'hotels', label: 'Hotels', icon: Hotel },
  { id: 'hospitals', label: 'Hospitals', icon: Stethoscope },
];

const CategoryChips = () => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity key={category.id} style={styles.chip}>
            <category.icon size={16} color={Colors.dark.text} />
            <Text style={styles.chipText}>{category.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.inputBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  chipText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
  },
});

export default CategoryChips;

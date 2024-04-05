import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecipeDetailScreen = ({ route }) => {
  const { id } = route.params;
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`http://10.0.2.2:8080/api/recipe/${id}`, {
            headers: {
              Authorization: `Bearer ${userToken}` 
            }
          });
        
        setRecipe(response.data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>INGREDIENT</Text>
        {recipe.ingredients.map((ingredient) => (
          <Text key={ingredient._id} style={styles.text}>{ingredient.name} - {ingredient.quantity}</Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TAGS</Text>
        {recipe.tags.map((step, index) => (
          <Text key={index} style={styles.text}>{index + 1}. {step}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>COOKING STEPS</Text>
        {recipe.cookingSteps.map((step, index) => (
          <Text key={index} style={styles.text}>{index + 1}. {step}</Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AUTHOR</Text>
        <Text style={styles.text}>{recipe.author}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F3E5F5', 
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#7B1FA2', 
  },
  section: {
    marginTop: 10,
    backgroundColor: '#EDE7F6', 
    padding: 5,
    borderRadius: 10, 
    shadowColor: '#000', 
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  sectionTitle: {
    fontWeight: 'bold',
    color: '#6A1B9A', 
    fontSize: 18,
    marginBottom: 5,
  },

  text: {
    fontSize: 16,
    color: '#4A148C', 
    marginBottom: 5,
    padding: 5,
  },
});

export default RecipeDetailScreen;
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
const RecipeUploadScreen = () => {
    const navigation = useNavigation();
  const [recipe, setRecipe] = useState({
    title: '',
    image: null,
    types: [],
    tools: [],
    location: '',
    tags: [],
    ingredients: [{ name: '', quantity: '' }],
    cookingSteps: []
  });

  useEffect(() => {
    const fetchUsername = async () => {
      const username = await AsyncStorage.getItem('username');
      setRecipe(prevRecipe => ({ ...prevRecipe, author: username }));
    };

    fetchUsername();
  }, []);

  const handleChange = (name, value) => {
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (index, name, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index][name] = value;
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { name: '', quantity: '' }]
    });
  };
  
  const handleCookingStepChange = (index, value) => {
    const newCookingSteps = [...recipe.cookingSteps];
    newCookingSteps[index] = value;
    setRecipe({ ...recipe, cookingSteps: newCookingSteps });
  };
  
  const addCookingStep = () => {
    setRecipe({
      ...recipe,
      cookingSteps: [...recipe.cookingSteps, '']
    });
  };

  const handleSubmit = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await fetch('http://10.0.2.2:8080/api/recipe', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${userToken}` ,
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(recipe),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.message || 'Something went wrong with the recipe upload!');
      }
  
      Alert.alert('Success', 'Recipe uploaded successfully!');
  
      setRecipe({
        title: '',
        types: [],
        tools: [],
        location: '',
        tags: [],
        ingredients: [{ name: '', quantity: '' }],
        cookingSteps: ['']
      });
  
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to upload the recipe');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        value={recipe.title}
        onChangeText={(value) => handleChange('title', value)}
      />


      {recipe.ingredients.map((ingredient, index) => (
        <View key={index}>
          <Text style={styles.label}>Ingredient {index + 1}:</Text>
          <TextInput
            style={styles.input}
            value={ingredient.name}
            placeholder="Name"
            onChangeText={(value) => handleIngredientChange(index, 'name', value)}
          />
          <TextInput
            style={styles.input}
            value={ingredient.quantity}
            placeholder="Quantity"
            onChangeText={(value) => handleIngredientChange(index, 'quantity', value)}
          />
        </View>
      ))}
      <Button title="Add Ingredient" onPress={addIngredient} />

      {recipe.cookingSteps.map((step, index) => (
        <View key={index}>
          <Text style={styles.label}>Step {index + 1}:</Text>
          <TextInput
            style={styles.input}
            value={step}
            placeholder="Cooking Step"
            onChangeText={(value) => handleCookingStepChange(index, value)}
          />
        </View>
      ))}
      <Button title="Add Cooking Step" onPress={addCookingStep} />

      <Button onPress={handleSubmit} title="Submit" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#fff',
    },
    label: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: 'gray',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
      fontSize: 14,
    },
    button: {
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 5, 
      alignItems: 'center', 
      marginTop: 10, 
    },
    buttonText: {
      color: '#fff',
      fontSize: 16, 
    },
  });
  

export default RecipeUploadScreen;
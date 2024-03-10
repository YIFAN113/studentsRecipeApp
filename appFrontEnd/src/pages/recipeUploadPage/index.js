import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, StyleSheet, Modal, TouchableOpacity } from 'react-native';
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

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const tags = ["beef", "chicken", "pork", "lamb", "fry"];

  useEffect(() => {
    const fetchUsername = async () => {
      const username = await AsyncStorage.getItem('username');
      console.log("Retrieved username:", username);
      setRecipe(prevRecipe => ({ ...prevRecipe, author: username }));
    };

    fetchUsername();
  }, []);

  const handleSelectTag = (tag) => {
    setSelectedTags(prevTags => {
      if (prevTags.includes(tag)) {
        return prevTags.filter(t => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const addTagsToRecipe = () => {
    setRecipe({ ...recipe, tags: selectedTags });
    toggleModal();
  };

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
      <TouchableOpacity style={styles.button} onPress={addIngredient}>
        <Text style={styles.buttonText}>Add Ingredient</Text>
      </TouchableOpacity>

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
      <TouchableOpacity style={styles.button} onPress={addCookingStep}>
        <Text style={styles.buttonText}>Add Cooking Step</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={toggleModal}
        activeOpacity={0.8} 
      >
        <Text style={styles.buttonText}>Add Tag</Text>
      </TouchableOpacity>

<Modal
  animationType="slide"
  transparent={true}
  visible={isModalVisible}
  onRequestClose={toggleModal}
>
  <View style={styles.modalView}>
    {tags.map((tag, index) => (
      <Button 
        key={index} 
        title={tag} 
        onPress={() => handleSelectTag(tag)} 
        color={selectedTags.includes(tag) ? 'blue' : 'gray'}
      />
    ))}
    <TouchableOpacity style={styles.button} onPress={addTagsToRecipe}>
            <Text style={styles.buttonText}>Confirm Tags</Text>
          </TouchableOpacity>
  </View>
</Modal>

<View>
  {recipe.tags.map((tag, index) => (
    <Text key={index}>{tag}</Text>
  ))}
</View>

<TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
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
    backgroundColor: '#E6E6FA',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#800080',
    fontSize: 16,
  },
  buttonTextSelected: {
    color: 'white',
    fontSize: 16,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
shadowColor: "#000",
shadowOffset: {
  width: 0,
  height: 2
},
shadowOpacity: 0.25,
shadowRadius: 4,
elevation: 5
},
});
  

export default RecipeUploadScreen;
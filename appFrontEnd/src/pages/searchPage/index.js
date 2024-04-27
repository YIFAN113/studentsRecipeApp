import React, { useState } from 'react';
import { View, Text,TextInput, FlatList, TouchableOpacity, StyleSheet, Modal,Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;
const RecipeSearchScreen = () => {
    const [selectedTags, setSelectedTags] = useState({
        cookingMethod: [],
        cookingTime: [],
        cost: [],
        category: [],
        suitableFor: []
      });
    const [recipes, setRecipes] = useState([]);
    const navigation = useNavigation();
    const [budget, setBudget] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const tagCategories = {
        cookingMethod: ["Grill", "Bake", "Fry", "Steam"],
        cookingTime: ["Under30min", "1hour", "2hours"],
        cost: ["2", "5", "7","10","15","20"],
        category: ["Vegetarian", "Non-Vegetarian", "Vegan"],
        suitableFor: ["Kids", "Diabetics", "WeightLoss"]
      };
      const toggleModal = () => {
        setModalVisible(!isModalVisible);
      };

      const handleSelectTag = (category, tag) => {
        setSelectedTags(prevTags => ({
            ...prevTags,
            [category]: prevTags[category].includes(tag) ? prevTags[category].filter(t => t !== tag) : [...prevTags[category], tag]
        }));
      };

      const handleSearch = async () => {
        try {
          const userToken = await AsyncStorage.getItem('userToken');
          if (!userToken) {
            console.error('Authentication token is not available');
            return;
          }
      
          let url = 'http://10.0.2.2:8080/api/recipe/search?';
          Object.keys(selectedTags).forEach(category => {
            if (selectedTags[category].length > 0) {
              url += `${category}=${encodeURIComponent(selectedTags[category].join(','))}&`;
            }
          });
          if (budget) {
            url += `budget=${encodeURIComponent(budget)}&`;
        }
          console.log("Final URL:", url);
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userToken}`,
            },
          });
      
          const responseData = await response.json();
          if (!response.ok) {
            throw new Error(responseData.message || 'Something went wrong while fetching recipes!');
          }
      
          setRecipes(responseData);
        } catch (error) {
          console.error('Failed to fetch recipes:', error);
          setRecipes([]);
        }
      };

    return (
        <View style={styles.container}>
 <TouchableOpacity
  style={styles.button}
  onPress={() => setModalVisible(true)}
>
  <Text style={styles.buttonText}>Select Tags</Text>
</TouchableOpacity>

<Modal
  animationType="slide"
  transparent={true}
  visible={isModalVisible}
  onRequestClose={toggleModal}
>
  <View style={styles.modalView}>
    {Object.keys(tagCategories).map(category => (
      <View key={category}>
        <Text style={styles.label}>{category}:</Text>
        {tagCategories[category].map(tag => (
          <Button
            key={tag}
            title={tag}
            onPress={() => handleSelectTag(category, tag)}
            color={selectedTags[category].includes(tag) ? 'blue' : 'gray'}
          />
        ))}
      </View>
    ))}
    
    <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
      <Text style={styles.buttonText}>Close</Text>
    </TouchableOpacity>
  </View>
</Modal>
<Text style={styles.label}>Set Budget:</Text>
<TextInput
                style={styles.input}
                onChangeText={setBudget}
                value={budget}
                placeholder="Enter your budget"
                keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={handleSearch}>
                <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
            <FlatList
                data={recipes}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('recipe', { id: item._id })}>
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
                )}
                keyExtractor={item => item._id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#F3E5F5', 
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
    tagContainer: {
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        marginBottom: 20,
        width: screenWidth,
    },
    tag: {
        borderWidth: 1,
        borderColor: '#007bff',
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 20,
        marginRight: 10,
        paddingVertical: 8, 
        paddingHorizontal: 12,
        width: '23%',
        height: 40, 
        justifyContent: 'center',
        alignItems: 'center',
        margin: '1%',
        
    },
    tagSelected: {
        backgroundColor: '#007bff',
    },
    tagText: {
        color: '#007bff',
        fontWeight: 'bold',
    },
    button: {
      backgroundColor: 'purple', 
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    recipeItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    recipeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    
});

export default RecipeSearchScreen;
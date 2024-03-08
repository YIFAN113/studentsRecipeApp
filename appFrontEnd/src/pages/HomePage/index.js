import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {

      const userToken = await AsyncStorage.getItem('userToken');
      
      const response = await axios.get('http://10.0.2.2:8080/api/recipe', {
        headers: {
          Authorization: `Bearer ${userToken}` 
        }
      });
      setRecipes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('recipe', { id: item._id })}>
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );



  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        numColumns={2}
      />
      <TouchableOpacity 
        style={styles.uploadButton} 
        onPress={() => navigation.navigate('recipeUpload')}
      >
        <Text style={styles.uploadText}>UPLOAD</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    alignItems: 'center', 
    flex: 1,
  },
  title: {
    fontSize: 24,
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#007bff',
    margin: 10,
  },
  uploadText: {
    color: 'white',
    fontSize: 18,
  },
});

export default HomeScreen;
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const HomeScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchRecipes();
    }, [])
  );

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
    <MenuProvider style={styles.container}>

<View style={styles.menuContainer}>
        <Menu onSelect={value => alert(`Selected number: ${value}`)}>
          <MenuTrigger text='Menu' />
          <MenuOptions>
            <MenuOption onSelect={() => navigation.navigate('map')} text='Map' />
            <MenuOption onSelect={() => navigation.navigate('recipeUpload')} text='Upload' />
            <MenuOption onSelect={() => navigation.navigate('search')} text='Search' />
            <MenuOption onSelect={() => navigation.navigate('UserProfile')} text='Edit Profile' /> 
            <MenuOption onSelect={() => navigation.navigate('favourites')} text='favourites' />
            <MenuOption onSelect={() => navigation.navigate('Upload')} text='uploadImage' />
          </MenuOptions>
        </Menu>
      </View>
      <Text style={styles.title}>Find recipes you love</Text>
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
      </MenuProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: '#F3E5F5', 
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
    fontWeight: 'bold',
    color: 'purple',
    textAlign: 'center',
    marginBottom: 20, 
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'purple',
    margin: 10,
  },
  uploadText: {
    color: 'white',
    fontSize: 18,
  },
  menuContainer: {
    alignItems: 'flex-end', 
    padding: 16, 
  },
});

export default HomeScreen;
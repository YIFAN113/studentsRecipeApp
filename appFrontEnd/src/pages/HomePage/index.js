import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const itemWidth = screenWidth * 0.4;
const itemHeight = screenHeight * 0.15;
const marginHeight = screenHeight * 0.025;
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

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], 
      });
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };


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

            <MenuOption onSelect={() => navigation.navigate('cookingLearning')} text='cookingLearning' />
            <MenuOption onSelect={logout} text='Logout' /> 
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
    padding: 8,
    marginVertical: 8,
    marginHorizontal: marginHeight,
    alignItems: 'center', 
    width: itemWidth,
    height: itemHeight,
    borderRadius:10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'purple',
    textAlign: 'center',
    
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
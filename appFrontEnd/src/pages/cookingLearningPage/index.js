import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const CookingLearningScreen = () => {
  const [cookingLearnings, setCookingLearnings] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchCookingLearnings();
    }, [])
  );

  const fetchCookingLearnings = async () => {
    try {

      const userToken = await AsyncStorage.getItem('userToken');
      
      const response = await axios.get('http://10.0.2.2:8080/api/cookingLearning', {
        headers: {
          Authorization: `Bearer ${userToken}` 
        }
      });
      setCookingLearnings(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('cookingLearningDetails', { id: item._id })}>
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );



  return (
    <View style={styles.container}>

      <Text style={styles.title}>Don't afraid, just try</Text>
      <FlatList
        data={cookingLearnings}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        numColumns={2}
      />
      
      </View>
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

export default CookingLearningScreen;
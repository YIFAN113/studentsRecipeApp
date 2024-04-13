import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const FavouritesScreen = () => {
  const [favouriteRecipes, setFavouriteRecipes] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await axios.get('http://10.0.2.2:8080/api/users/favourites', {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      setFavouriteRecipes(response.data.favouriteRecipes);
    } catch (error) {
      console.error('Error fetching favourites:', error);
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
        data={favouriteRecipes}
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
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    alignItems: 'center', 
    flex: 1,
  },
});

export default FavouritesScreen;
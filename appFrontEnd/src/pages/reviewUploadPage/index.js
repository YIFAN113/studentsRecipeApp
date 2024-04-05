import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ReviewUploadScreen = ({ route }) => {
  const navigation = useNavigation();
  const { recipeId } = route.params; 
  const [review, setReview] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
  
    const fetchUsername = async () => {
      const username = await AsyncStorage.getItem('username');
      setAuthor(username);
    };

    fetchUsername();
  }, []);

  const handleSubmit = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await fetch(`http://10.0.2.2:8080/api/recipe/${recipeId}/review`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: review, postedBy: author })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Something went wrong with the review upload!');
      }

      Alert.alert('Success', 'Review uploaded successfully!');
      navigation.goBack(); 
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to upload the review');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Your Review:</Text>
      <TextInput
        style={styles.input}
        value={review}
        onChangeText={setReview}
        placeholder="Write your review here..."
        multiline={true}
        numberOfLines={4}
      />
      <Button title="Submit Review" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    textAlignVertical: 'top',
  },
});

export default ReviewUploadScreen;
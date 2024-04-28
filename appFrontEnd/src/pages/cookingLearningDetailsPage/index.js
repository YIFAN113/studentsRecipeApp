import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet,  TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const CookingLearningDetailsScreen = ({ route }) => {
  const { id } = route.params;
  const [cookingLearningDetails, setCookingLearningDetails] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCookingLearningDetails = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`http://10.0.2.2:8080/api/cookingLearning/${id}`, {
            headers: {
              Authorization: `Bearer ${userToken}` 
            }
          });
        
          setCookingLearningDetails(response.data);
      } catch (error) {
        console.error('Error fetching cooking learing details:', error);
      }
    };

    fetchCookingLearningDetails();
  }, [id]);


  return (
    <ScrollView style={styles.container}>
    {cookingLearningDetails ? (
      <>
        <Text style={styles.title}>{cookingLearningDetails.title}</Text>
        <Text style={styles.text}>{cookingLearningDetails.content}</Text>
      </>
    ) : (
      <Text>Loading...</Text> 
    )}
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
  reviewSection: {
    backgroundColor: '#E1BEE7', 
    padding: 5,
    borderRadius: 5,
    marginVertical: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewText: {
    fontSize: 16,
    color: '#6A1B9A', 
    flex: 1,
  },
  uploadButton: {
    padding: 10,
    backgroundColor: '#7B1FA2',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  uploadText: {

    color: '#FFFFFF',
    fontSize: 16,
  },
  reviewDate: {
    color: '#6A1B9A',
    fontSize: 12,
    textAlign: 'right',
    flexShrink: 1,
  },
  tagCategoryTitle: {
    fontWeight: 'bold',
    color: '#6A1B9A',
    fontSize: 16,
    marginBottom: 5,
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tagChip: {
    backgroundColor: '#E1BEE7',  
    borderRadius: 15,          
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,      
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    color: '#4A148C',      
    fontSize: 14,
  }

});


export default CookingLearningDetailsScreen;
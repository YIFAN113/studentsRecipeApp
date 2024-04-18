import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet,  TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const RecipeDetailScreen = ({ route }) => {
  const { id } = route.params;
  const [recipe, setRecipe] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`http://10.0.2.2:8080/api/recipe/${id}`, {
            headers: {
              Authorization: `Bearer ${userToken}` 
            }
          });
        
        setRecipe(response.data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    fetchRecipe();
  }, [id]);

  const addToFavorites = async () => {
    try {
        const userToken = await AsyncStorage.getItem('userToken');
        // 注意这里的 URL 已经不再包含用户名，仅传递 recipeId
        await axios.post(`http://10.0.2.2:8080/api/users/favourites/add/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });
        Alert.alert("Success", "Recipe added to favorites!");
    } catch (error) {
        console.error('Error adding to favorites:', error);
        Alert.alert("Error", "Failed to add recipe to favorites.");
    }
};

  if (!recipe) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>INGREDIENT</Text>
        {recipe.ingredients.map((ingredient) => (
          <Text key={ingredient._id} style={styles.text}>{ingredient.name} - {ingredient.quantity}</Text>
        ))}
      </View>
      <View style={styles.section}>
  <Text style={styles.sectionTitle}>TAGS</Text>
  {Object.keys(recipe.tags).map((category) => (
    <View key={category}>
      <Text style={styles.tagCategoryTitle}>{category.replace(/([A-Z])/g, ' $1').trim()}:</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.tagContainer}>
        {recipe.tags[category].map((tag, index) => (
          <View key={index} style={styles.tagChip}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  ))}
</View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>COOKING STEPS</Text>
        {recipe.cookingSteps.map((step, index) => (
          <Text key={index} style={styles.text}>{index + 1}. {step}</Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AUTHOR</Text>
        <Text style={styles.text}>{recipe.author}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>REVIEWS</Text>
        {recipe.reviews && recipe.reviews.length > 0 ? (
          recipe.reviews.map((review, index) => (
            <View key={index} style={styles.reviewSection}>
              <Text style={styles.reviewText}>{review.postedBy}: {review.text}</Text>
              <Text style={styles.reviewDate}>{new Date(review.createdAt).toLocaleString()}</Text>

            </View>
          ))
        ) : (
          <Text style={styles.text}>No reviews yet.</Text>
        )}
      </View>
      <TouchableOpacity 
        style={styles.uploadButton} 
        onPress={() => navigation.navigate('review', { recipeId: id })}
      >
        <Text style={styles.uploadText}>UPLOAD REVIEW</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.uploadButton} 
        onPress={addToFavorites}
      >
        <Text style={styles.uploadText}>ADD TO FAVORITES</Text>
      </TouchableOpacity>
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
    backgroundColor: '#E1BEE7',  // 浅紫色背景
    borderRadius: 15,            // 圆角
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,         // 芯片之间的间隔
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    color: '#4A148C',            // 深紫色文本
    fontSize: 14,
  }

});


export default RecipeDetailScreen;
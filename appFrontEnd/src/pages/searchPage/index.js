import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;
const RecipeSearchScreen = () => {
    const [selectedTags, setSelectedTags] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const navigation = useNavigation();
    const tags = ["beef", "chicken", "pork", "lamb", "fry"];

    const handleSelectTag = (tag) => {
        setSelectedTags(prevSelectedTags => {
            if (prevSelectedTags.includes(tag)) {
                return prevSelectedTags.filter(t => t !== tag); 
            } else {
                return [...prevSelectedTags, tag]; 
            }
        });
    };

    const handleSearch = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            

            if (!userToken) {
                console.error('Authentication token is not available');
                return;
            }
    
            let url = `http://10.0.2.2:8080/api/recipe/search?`;
            if (selectedTags.length > 0) {
                url += `tags=${encodeURIComponent(selectedTags.join(','))}`;
            }
    
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
            <ScrollView horizontal={false} contentContainerStyle={styles.tagContainer}>
                {tags.map((tag, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.tag, selectedTags.includes(tag) ? styles.tagSelected : {}]}
                        onPress={() => handleSelectTag(tag)}
                    >
                        <Text style={styles.tagText}>{tag}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
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
        backgroundColor: '#007bff',
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
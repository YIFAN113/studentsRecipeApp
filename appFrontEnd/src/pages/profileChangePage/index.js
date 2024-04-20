import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {

    const getUserInfo = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const id = await AsyncStorage.getItem('userId'); 
        console.log('UserId:', id);

        if (id) setUserId(id);

      } catch (error) {
        console.error('Failed to fetch user info from storage', error);
      }
    };

    getUserInfo();
  }, []);

  const updateProfile = async () => {
    if (!username && !password) {
      Alert.alert('Error', 'Please enter username or password to update.');
      return;
    }
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const body = {};
      if (username) body.username = username;
      if (password) body.password = password;
      console.log(`Request URL: http://10.0.2.2:8080/api/users/${userId}`);
      const response = await axios.put(`http://10.0.2.2:8080/api/users/${userId}`, body, {
        headers: { Authorization: `Bearer ${userToken}` }
      });

      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={updateProfile} disabled={!userId}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  label: {
    fontSize: 16,
    marginBottom: 5
  },
  input: {
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  }
});

export default UserProfileScreen;
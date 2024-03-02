import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
// import { login } from '../../api/user';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginPress = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8080/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
  
      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log("Login successful", result);
        const token = result.token.split(' ')[1];
        await AsyncStorage.setItem('userToken', token); 
      } else {
        console.error("Login failed", result);
        Alert.alert("Login Failed", result.message || "Please try again.");
      }
    } catch (error) {
      console.error("Login error", error);
      Alert.alert("Login Error", error.message || "An error occurred during login. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
    <Text style={styles.Text}>Welcome</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLoginPress} color={'red'} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  Text:{
    textAlign: 'center',
    color:"red"
  }
});

export default LoginScreen;

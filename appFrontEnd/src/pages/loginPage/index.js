import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
// import { login } from '../../api/user';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

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
        const userId = result.userId;
        await AsyncStorage.setItem('userToken', token); 
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('userId', userId);
        navigation.navigate('Home');
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
      <Text style={styles.title}>Students' spoon</Text>
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
   <View style={styles.buttonContainer}>
      <Button title="Login" onPress={handleLoginPress} color={'purple'} />
    </View>
    <View style={styles.buttonContainer}>
      <Button title="Sign Up" onPress={() => navigation.navigate('signup')} color={'purple'} />
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F3E5F5', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'purple',
    textAlign: 'center',
    marginBottom: 20, 
  },
  buttonContainer: {
    marginTop: 10,
    width: '50%', 
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '90%', 
  },
  Text:{
    textAlign: 'center',
    color:"purple"
  }
});

export default LoginScreen;

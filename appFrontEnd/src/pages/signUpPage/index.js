import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegisterPress = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8080/api/users?action=register', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'post',
        body: JSON.stringify({ username: username, password: password })
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Registration successful", result);
        Alert.alert("Registration Successful", "You have successfully registered. Please log in.");
      } else {
        console.error("Registration failed", result);
        Alert.alert("Registration Failed", result.message || "Please try again.");
      }
    } catch (error) {
      console.error("Registration error", error);
      Alert.alert("Registration Error", error.message || "An error occurred during registration. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
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
      <Button title="Register" onPress={handleRegisterPress} color={'red'} />
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
  title: {
    textAlign: 'center',
    color: "red",
    marginBottom: 20,
  },
});

export default RegisterScreen;
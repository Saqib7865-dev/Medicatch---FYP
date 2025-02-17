import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";

const SignUp = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  let router = useRouter();
  const handleSignup = async () => {
    if (!name || !username || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    let userRegister = await fetch("http://172.16.100.46:3001/users/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (!userRegister.ok) return Alert.alert("User registration failed");
    let userRegisterJson = await userRegister.json();
    if (userRegisterJson.message)
      if (userRegisterJson.message === "User registered successfully") {
        Alert.alert("Success", userRegisterJson.message);
        setTimeout(() => {
          setUsername("");
          setName("");
          setPassword("");
          setConfirmPassword("");
          router.replace("/LoginScreen");
        }, 2000);
      } else return Alert.alert("Message", userRegisterJson.message);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <Image
        source={require("./../../assets/logo1.png")} // Update the path as needed
        style={styles.logo}
      />

      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={(text) => setName(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#999"
        keyboardType="default"
        value={username}
        onChangeText={(text) => setUsername(text.trim())}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#999"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.loginPrompt}>
        <Text style={styles.promptText}>Already have an account?</Text>
        <TouchableOpacity>
          <Text style={styles.loginText}>
            {" "}
            <Link href="./LoginScreen">Log in</Link>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    fontFamily: "serif",

    alignItems: "center",
    backgroundColor: "#e8f5fa",
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    fontFamily: "serif",

    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontFamily: "serif",

    fontWeight: "600",
    color: "#333",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: 15,
    fontFamily: "serif",

    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#D1D9E6",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#4173A1",
    fontFamily: "serif",

    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#e8f5fa",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "serif",

    fontWeight: "bold",
  },
  loginPrompt: {
    flexDirection: "row",
    marginTop: 20,
    fontFamily: "serif",
  },
  promptText: {
    fontSize: 16,
    color: "#555",
    fontFamily: "serif",
  },
  loginText: {
    fontSize: 16,
    color: "#4173A1",
    fontFamily: "serif",

    fontWeight: "bold",
  },
});

export default SignUp;

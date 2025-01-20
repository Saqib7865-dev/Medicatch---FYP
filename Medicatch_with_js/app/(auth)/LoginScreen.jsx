import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { storeToken } from "../../utils/tokenStorage";

const loginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let router = useRouter();
  const handleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("Error", "Please fill in both fields");
      return;
    } else {
      let userLogin = await fetch(`http://192.168.1.4:3001/users/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });
      let userLoginJson = await userLogin.json();
      if (userLoginJson.message) {
        if (userLoginJson.message === "Login successful") {
          await storeToken(userLoginJson.token);
          console.log("welcome");
          Alert.alert("Success", userLoginJson.message);
          setTimeout(() => {
            router.push("/(tabs)");
          }, 2000);
        } else return Alert.alert("message:", userLoginJson.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("./../../assets/logo1.png")} // Update the path as needed
        style={styles.logo}
      />
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.input}
        placeholder="username"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Link href="/SignUpScreen" style={styles.Link}>
        Don't have any account?
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#c6e6f3",
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#333",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: 15,
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
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#c6e6f3",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  Link: {
    color: "#4173A1",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
  },
});

export default loginScreen;

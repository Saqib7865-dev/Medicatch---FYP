import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { jwtDecode } from "jwt-decode";
import { useAppContext } from "../context/context";

const loginScreen = () => {
  const { setUser } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let router = useRouter();
  const handleLogin = async () => {
    try {
      if (email === "" || password === "") {
        Alert.alert("Error", "Please fill in both fields");
        return;
      } else {
        let userLogin = await fetch(`http://192.168.0.105:3001/users/login`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ username: email, password: password }),
        });
        let userLoginJson = await userLogin.json();
        if (userLoginJson.message) {
          if (userLoginJson.message === "Login successful") {
            await storeToken(userLoginJson.token);
            const token = userLoginJson.token;
            // Decode the token
            const decodedToken = jwtDecode(token);

            Alert.alert("Success", userLoginJson.message);
            console.log(userLoginJson, "resp........");

            setUser({ ...decodedToken, username: userLoginJson.username });

            setTimeout(() => {
              router.replace("/(tabs)");
            }, 2000);
          } else return Alert.alert("message:", userLoginJson.message);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const myLogin = async () => {
    try {
      let userLogin = await fetch(`http://192.168.0.105:3001/users/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ username: "Pharmacy2", password: "11223344" }),
      });

      let userLoginJson = await userLogin.json();

      if (userLoginJson.message) {
        if (userLoginJson.message === "Login successful") {
          const token = userLoginJson.token;

          // Decode the token
          const decodedToken = jwtDecode(token);
          console.log(userLoginJson, "resp........");

          setUser({ ...decodedToken, username: userLoginJson.username });

          await storeToken(token);
          console.log("welcome", decodedToken);
          Alert.alert("Success", userLoginJson.message);
          setTimeout(() => {
            router.push("/(tabs)");
          }, 2000);
        } else {
          return Alert.alert("Message:", userLoginJson.message);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    myLogin();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("./../../assets/logo1.png")} // Update the path as needed
        style={styles.logo}
      />
      <Text style={styles.title}>Log In</Text>

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
    backgroundColor: "#e8f5fa",
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
    shadowColor: "#e8f5fa",
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

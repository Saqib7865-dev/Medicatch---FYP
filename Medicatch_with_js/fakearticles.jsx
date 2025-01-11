import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

// Function to generate fake articles
const generateFakeArticles = (numArticles) => {
  const fakeArticles = [];
  for (let i = 0; i < numArticles; i++) {
    fakeArticles.push({
      title: `Fake Article ${i + 1}`,
      content: `This is the content of fake article ${i + 1}.`,
      date: new Date(Date.now() - i * 86400000).toISOString(), // Fake date (subtracting i days)
      tags: [`tag${i + 1}`, "health", "lifestyle"],
    });
  }
  return fakeArticles;
};

const HealthArticles = () => {
  const [loading, setLoading] = useState(false);

  const handleSendFakeArticles = async () => {
    setLoading(true);
    const fakeArticles = generateFakeArticles(10);
    console.log(fakeArticles); // Generate 10 fake articles
    try {
      const response = await fetch("http://localhost:3000/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fakeArticles[0]),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("sent");
        // Alert.alert("Success", "Fake articles sent successfully!");
      } else {
        Alert.alert("Error", data.message || "Failed to send articles");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while sending articles");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSendFakeArticles}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Sending..." : "Send Fake Articles"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#c6e6f3",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4173A1",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HealthArticles;

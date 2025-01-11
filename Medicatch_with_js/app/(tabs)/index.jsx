import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons"; // Icon for search (Install with: npm install @expo/vector-icons)
import { router } from "expo-router";

const quotes = [
  "An apple a day keeps the doctor away.",
  "Health is wealth.",
  "A fit body leads to a fit mind.",
  "Take care of your body. It's the only place you have to live.",
  "Early to bed and early to rise makes a person healthy, wealthy, and wise.",
  "The groundwork for all happiness is good health.",
  "Your health is your greatest wealth.",
];

const Home = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Pick a random quote when the component mounts
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Feather name="menu" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.welcomeText}>Welcome</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for Pharmacy"
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.searchButton}>
          <Feather name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Quote Section */}
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteText}>{quote}</Text>
      </View>

      {/* Articles Grid */}
      <View style={styles.articlesGrid}>
        {/* Health Articles Section */}
        <View style={styles.articlesHeader}>
          <Text style={styles.articlesTitle}>Health Articles</Text>
          <TouchableOpacity>
            <Text
              style={styles.viewAllText}
              onPress={() => router.push("/Health Articles")}
            >
              View All
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ width: "100%" }}>
          <Image
            source={require("./../../assets/home1.png")}
            style={styles.articleImage}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 20,
            width: Dimensions.get("window").width,
          }}
        >
          <Image
            source={require("./../../assets/home1.png")}
            style={{
              width: Dimensions.get("window").width / 2 - 30,
              height: 120,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />
          <Image
            source={require("./../../assets/home1.png")}
            style={{
              width: Dimensions.get("window").width / 2 - 30,
              height: 120,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />
        </View>
        <Image
          source={require("./../../assets/home1.png")}
          style={styles.articleImage}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#c6e6f3",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  quoteContainer: {
    backgroundColor: "#228a03",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#fff",
    textAlign: "center",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  searchInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#D1D9E6",
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#4173A1",
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  articlesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  articlesTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  viewAllText: {
    fontSize: 14,
    color: "#4173A1",
    fontWeight: "bold",
  },
  articlesGrid: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
  },
  articleImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default Home;

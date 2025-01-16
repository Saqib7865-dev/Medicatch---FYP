import React from "react";
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

const Home = () => {
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

      {/* Articles Grid */}

      <View style={styles.articlesGrid}>
        {/* Health Articles Section */}
        <View style={styles.articlesHeader}>
          <Text style={styles.articlesTitle}>Health Articles</Text>
          <TouchableOpacity>
            <Text
              style={styles.viewAllText}
              onPress={() => router.push("/(auth)/LoginScreen")}
            >
              View All
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: "100%",
          }}
        >
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
            // style={styles.articleImage}
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
    alignSelf: "stretch",
    width: Dimensions.get("window").width - 40,
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
    flexWrap: "wrap",
    justifyContent: "center",
    flex: 1,
  },
  articleImage: {
    // width: Dimensions.get("window").width / 2 - 30,
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default Home;

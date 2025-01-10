import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons"; // Install using: npm install @expo/vector-icons

const articles = [
  {
    id: 1,
    title: "COVID-19: A Brief Guide",
    date: "2023-10-20T09:15:00Z", // Different date
    image: require("./../../assets/home1.png"),
  },
  {
    id: 2,
    title: "Balanced: Weight Loss",
    date: "2023-09-15T14:30:00Z", // Different date
    image: require("./../../assets/home1.png"),
  },
  {
    id: 3,
    title: "Essential Tips: Prevent Cancer",
    date: "2023-11-01T12:00:00Z", // Different date
    image: require("./../../assets/home1.png"),
  },
  {
    id: 4,
    title: "Side Effects of Excessive Tea",
    date: "2023-08-05T08:45:00Z", // Different date
    image: require("./../../assets/home1.png"),
  },
  {
    id: 4,
    title: "Side Effects of Excessive Tea",
    date: "2023-08-05T08:45:00Z", // Different date
    image: require("./../../assets/home1.png"),
  },
  {
    id: 4,
    title: "Side Effects of Excessive Tea",
    date: "2023-08-05T08:45:00Z", // Different date
    image: require("./../../assets/home1.png"),
  },
  {
    id: 4,
    title: "Side Effects of Excessive Tea",
    date: "2023-08-05T08:45:00Z", // Different date
    image: require("./../../assets/home1.png"),
  },
  {
    id: 4,
    title: "Side Effects of Excessive Tea",
    date: "2023-08-05T08:45:00Z", // Different date
    image: require("./../../assets/home1.png"),
  },
  {
    id: 4,
    title: "Side Effects of Excessive Tea",
    date: "2023-08-05T08:45:00Z", // Different date
    image: require("./../../assets/home1.png"),
  },
  {
    id: 4,
    title: "Side Effects of Excessive Tea",
    date: "2023-08-05T08:45:00Z", // Different date
    image: require("./../../assets/home1.png"),
  },
];

// Function to format the date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const HealthArticles = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Articles</Text>
      </View>

      {/* Articles List */}
      {articles.map((article) => (
        <View key={article.id} style={styles.articleCard}>
          <Image source={article.image} style={styles.articleImage} />
          <View style={styles.articleContent}>
            <Text style={styles.articleTitle}>{article.title}</Text>
            <Text style={styles.articleDate}>{formatDate(article.date)}</Text>
          </View>
        </View>
      ))}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  articleCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  articleImage: {
    width: 100,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
  },
  articleContent: {
    flex: 1,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  articleDate: {
    fontSize: 14,
    color: "#555",
  },
});

export default HealthArticles;

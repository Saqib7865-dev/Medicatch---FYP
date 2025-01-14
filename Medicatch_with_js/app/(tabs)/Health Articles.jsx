import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons"; // Install using: npm install @expo/vector-icons
import { useRouter } from "expo-router"; // Use router for navigation

const API_URL = "http://192.168.100.21:3000/articles"; // Replace with your backend API URL

const formatDate = (dateString) => {
  if (!dateString) return "Unknown Date";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const HealthArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [allLoaded, setAllLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true); // Mock admin status
  const router = useRouter();

  const fetchArticles = async (pageNumber = 1) => {
    if (loading || allLoaded) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}`);
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      const data = await response.json();
      if (data.length === 0) {
        setAllLoaded(true);
      } else {
        setArticles((prevArticles) => [...prevArticles, ...data]);
        setPage(pageNumber);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Articles</Text>
      </View>

      {/* Admin "Create Article" Button */}
      {isAdmin && (
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/Screens/CreateArticle")}
        >
          <Text style={styles.createButtonText}>Create Article</Text>
        </TouchableOpacity>
      )}

      {/* Articles List */}
      {articles.map((article) => (
        <View key={article._id} style={styles.articleCard}>
          <Image source={{ uri: article.image }} style={styles.articleImage} />
          <View style={styles.articleContent}>
            <Text style={styles.articleTitle}>{article.title}</Text>
            <Text style={styles.articleDate}>
              {formatDate(article.createdAt)}
            </Text>
          </View>
        </View>
      ))}

      {/* Load More Button */}
      {!allLoaded && (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={() => fetchArticles(page + 1)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.loadMoreText}>Load More</Text>
          )}
        </TouchableOpacity>
      )}

      {allLoaded && (
        <Text style={styles.endMessage}>No more articles to load</Text>
      )}
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
  createButton: {
    backgroundColor: "#4173A1",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  loadMoreButton: {
    backgroundColor: "#4173A1",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  loadMoreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  endMessage: {
    marginTop: 10,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
});

export default HealthArticles;

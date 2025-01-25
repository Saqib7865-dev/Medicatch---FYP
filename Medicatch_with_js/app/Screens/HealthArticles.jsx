import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppContext } from "../context/context";

const API_URL = "http://192.168.18.8:3001/articles";

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
  const { user, articles } = useAppContext();

  // const [articles, setArticles] = useState([]);
  const [searchedArticles, setSearchedArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // To handle errors
  const router = useRouter();

  // const fetchArticles = async () => {
  //   setLoading(true);
  //   setErrorMessage(""); // Reset error message
  //   try {
  //     const response = await fetch(`${API_URL}`);
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch articles");
  //     }
  //     const data = await response.json();
  //     if (data.length === 0) {
  //       setErrorMessage("No articles available."); // Set message if no articles
  //     }
  //     setArticles(data);
  //     console.log(data, "fetched articles");
  //   } catch (error) {
  //     setErrorMessage(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const searchArticles = async (query) => {
    if (!query.trim()) {
      setSearchedArticles([]); // Reset search results if query is empty
      setErrorMessage("");
      return;
    }

    setLoading(true);
    setErrorMessage(""); // Reset error message
    try {
      const response = await fetch(
        `http://192.168.18.8:3001/articles/search/?query=${query}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await response.json();
      if (data.length === 0) {
        setErrorMessage("No articles found for your search."); // Set message if no results
      }
      setSearchedArticles(data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchedArticles([]); // Reset to show all articles if query is empty
      setErrorMessage(""); // Reset error message
    } else {
      searchArticles(query);
    }
  };

  useEffect(() => {
    // fetchArticles();
  }, []);

  const displayedArticles =
    searchedArticles.length > 0 || searchQuery.trim() !== ""
      ? searchedArticles
      : articles;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Articles</Text>
      </View>

      {/* Admin "Create Article" Button */}
      {user.role === "admin" && (
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/Screens/CreateArticle")}
        >
          <Text style={styles.createButtonText}>Create Article</Text>
        </TouchableOpacity>
      )}

      {/* Search Section */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for Articles"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {/* <TouchableOpacity style={styles.searchButton}>
          <Feather name="search" size={20} color="#fff" />
        </TouchableOpacity> */}
      </View>

      {/* Error or Loading Message */}
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : displayedArticles.length > 0 ? (
        displayedArticles.map((article) => (
          <TouchableOpacity
            key={article._id}
            onPress={() =>
              router.push({
                pathname: "/Screens/ArticleDetails",
                params: { ...article },
              })
            }
          >
            <View style={styles.articleCard}>
              {/* <Image
                // source={require("http://localhost:3001/uploads/eb992833-3242-4267-95af-8ca449d4dcef.png")}
                // source={{ uri: article.image }}
                source={{
                  uri: "http://localhost:3001/uploads/eb992833-3242-4267-95af-8ca449d4dcef.png ",
                }}
                style={styles.articleImage}
              /> */}
              <Image
                // source={require("./../../assets/home1.png")}
                source={{
                  uri: `http://192.168.18.8:3001/uploads/${
                    article?.image?.split("\\")[1]
                  }`,
                }}
                // width={45}
                // height={45}
                style={styles.articleImage}
              />
              <View style={styles.articleContent}>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleContentText}>
                  {article.content.length > 20
                    ? `${article.content.slice(0, 8)}...`
                    : article.content}
                </Text>
                <Text style={styles.articleDate}>
                  {formatDate(article.createdAt)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noArticlesText}>No articles available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#e8f5fa",
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
  articleContentText: {
    fontSize: 12,
    marginBottom: 5,
  },
  articleDate: {
    fontSize: 14,
    color: "#555",
  },
  loadingText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  errorMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
  },
  noArticlesText: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
  },
});

export default HealthArticles;

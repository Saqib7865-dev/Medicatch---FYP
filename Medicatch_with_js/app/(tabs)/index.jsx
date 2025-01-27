import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  AppState,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getToken, removeToken } from "../../utils/tokenStorage";
import SideDrawer from "../components/side-drawer";
import { useAppContext } from "../context/context";
import { useNotification } from "../context/NotificationsContext";

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
  const { user, articles, setArticles, setContextualMed } = useAppContext();
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quote, setQuote] = useState(""); // Ensure quote is initialized as an empty string
  const [loading, setLoading] = useState(true);
  const [medicineName, setMedicineName] = useState("");

  const { expoPushToken, notification, error } = useNotification();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await getToken();
      if (!token) {
        router.replace("/(auth)/LoginScreen"); // Redirect before rendering
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false); // Stop the loading indicator
    };

    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        // Remove token when app goes to background or becomes inactive
        await removeToken();
      }
    };

    // Set a random quote on component mount
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    checkAuthentication();

    // Add AppState listener
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://192.168.0.105:3001/articles`);
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        if (data.length === 0) {
        } else {
          setArticles(data);
          setIsLoading(false);
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
        console.log("Articles: ", articles);
      }
    };
    if (isAuthenticated) {
      fetchArticles();
    }
  }, [isAuthenticated]);
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3798CE" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return null; // Avoid rendering anything if unauthenticated
  }
  // console.log(user);
  // if (error) return <>Met with an error</>;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <SideDrawer isOpen={true} /> */}
      {/* Header Section */}
      <View style={styles.header}>
        {/* <TouchableOpacity>
          <Feather name="menu" size={24} color="#000" />
        </TouchableOpacity> */}
        <Text style={styles.welcomeText}>Welcome, {user?.username}</Text>
      </View>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for Medicine"
          placeholderTextColor="#999"
          value={medicineName}
          onChangeText={setMedicineName}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            if (medicineName) {
              setContextualMed(medicineName);
              router.push({
                pathname: "(tabs)/Search2",
              });
            } else {
              Alert.alert("No Medicine", "Please enter medicine name.");
            }
          }}
        >
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
              // onPress={() => router.push("/(auth)/LoginScreen")}
              onPress={() => router.push("/Screens/HealthArticles")}
            >
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.articlesDescription}>
          Explore our curated health articles to inspire your journey toward a
          healthier, happier lifestyle.
        </Text>
        {/* Single Large Article Card */}
        {articles?.map((article, index) => {
          if (index <= 3) {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  router.push({
                    pathname: "/Screens/ArticleDetails",
                    params: { ...article },
                  });
                }}
              >
                <View style={styles.articleCard}>
                  <Image
                    source={require("./../../assets/home1.png")}
                    style={styles.articleImage}
                  />
                  <View style={styles.overlay}>
                    <Text style={styles.overlayText}>{article.title}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }
        })}

        {/* Smaller Article Cards */}
      </View>
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
  articlesDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    lineHeight: 20,
  },
  // articlesGrid: {
  //   flexDirection: "column",
  //   justifyContent: "center",
  //   flex: 1,
  // },
  // articleImage: {
  //   width: "100%",
  //   height: 120,
  //   borderRadius: 10,
  //   marginBottom: 10,
  // },
  articleCard: {
    position: "relative",
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  articleImage: {
    width: "100%",
    height: 120,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    padding: 10,
    alignItems: "center",
    height: "100%",
    flex: "column",
    justifyContent: "center",
  },
  overlayText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#3798CE",
  },
});

export default Home;

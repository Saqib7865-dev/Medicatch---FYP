import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAppContext } from "../context/context";

const formatDate = (dateString) => {
  if (!dateString) return "Unknown Date";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const ArticleDetails = () => {
  const { user, setArticles } = useAppContext();
  const params = useLocalSearchParams();
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState("");
  const [isLoadingFeedbacks, setIsLoadingFeedbacks] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const getFeedbacks = async () => {
    setIsLoadingFeedbacks(true);
    try {
      const resp = await fetch(
        `http://172.16.100.46:3001/feedback/${params._id}`
      );
      const data = await resp.json();
      setFeedbacks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingFeedbacks(false);
    }
  };

  const postFeedback = async () => {
    if (!newFeedback.trim()) {
      Alert.alert("Error", "Feedback cannot be empty.");
      return;
    }
    setIsSubmittingFeedback(true);
    try {
      const resp = await fetch(
        `http://172.16.100.46:3001/feedback/${params._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            feedback: newFeedback,
          }),
        }
      );
      if (resp.ok) {
        setNewFeedback("");
        getFeedbacks();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to post feedback.");
      console.error(error);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleEditArticle = () => {
    router.push({
      pathname: "/Screens/CreateArticle",
      params: params,
    });
  };

  const handleDeleteArticle = () => {
    Alert.alert(
      "Delete Article",
      "Are you sure you want to delete this article?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const resp = await fetch(
                `http://172.16.100.46:3001/articles/${params._id}`,
                {
                  method: "DELETE",
                }
              );
              if (resp.ok) {
                setArticles((prevArticles) =>
                  prevArticles.filter((article) => article._id !== params._id)
                );

                router.replace("/Screens/HealthArticles"); // Navigate back after deletion
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete article.");
              console.error(error);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    getFeedbacks();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <Image
        source={{
          uri: `http://172.16.100.46:3001/uploads/${
            params?.image?.split("\\")[1]
          }`,
        }}
        style={styles.articleImage}
      />

      <Text style={styles.title}>{params.title}</Text>
      <Text style={styles.date}>{formatDate(params.createdAt)}</Text>
      <Text style={styles.content}>{params.content}</Text>

      {/* Admin Actions */}
      {user?.role === "admin" && (
        <View style={styles.adminActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={handleEditArticle}
          >
            <Text style={styles.actionButtonText}>Edit Article</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDeleteArticle}
          >
            <Text style={styles.actionButtonText}>Delete Article</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Feedback Section */}
      <View style={styles.feedbackSection}>
        <Text style={styles.feedbackHeader}>Feedbacks</Text>
        {isLoadingFeedbacks ? (
          <ActivityIndicator size="large" color="#4173A1" />
        ) : (
          <FlatList
            data={feedbacks}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <View style={styles.feedbackCard}>
                <Text style={styles.feedbackUser}>
                  {item.userId?.username} says:
                </Text>
                <Text style={styles.feedbackText}>{item.feedback}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.noFeedbackText}>
                No feedbacks available. Be the first to leave one!
              </Text>
            }
          />
        )}
        <TextInput
          style={styles.feedbackInput}
          placeholder="Write your feedback..."
          value={newFeedback}
          onChangeText={setNewFeedback}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={postFeedback}
          disabled={isSubmittingFeedback}
        >
          {isSubmittingFeedback ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ArticleDetails;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#e8f5fa",
    fontFamily: "serif",
    flex: 1,
  },
  backButton: {
    marginBottom: 20,
    fontFamily: "serif",
  },
  articleImage: {
    width: "100%",
    height: 200,
    fontFamily: "serif",
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "serif",
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: "#555",
    fontFamily: "serif",
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "serif",
    marginBottom: 20,
  },
  adminActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: "serif",
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    fontFamily: "serif",
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    fontFamily: "serif",
  },
  deleteButton: {
    backgroundColor: "#F44336",
    fontFamily: "serif",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "serif",
    fontWeight: "bold",
  },
  feedbackSection: {
    marginTop: 20,
    fontFamily: "serif",
  },
  feedbackHeader: {
    fontSize: 18,
    fontFamily: "serif",
    fontWeight: "bold",
    marginBottom: 10,
  },
  feedbackCard: {
    backgroundColor: "#fff",
    padding: 10,
    fontFamily: "serif",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackUser: {
    fontSize: 14,
    fontFamily: "serif",
    fontWeight: "bold",
    marginBottom: 5,
  },
  feedbackText: {
    fontSize: 14,
    fontFamily: "serif",
    color: "#555",
  },
  noFeedbackText: {
    fontSize: 14,
    fontFamily: "serif",
    color: "#777",
    textAlign: "center",
    marginBottom: 10,
  },
  feedbackInput: {
    padding: 10,
    fontFamily: "serif",
    borderWidth: 1,
    borderColor: "#D1D9E6",
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#4173A1",
    padding: 10,
    fontFamily: "serif",
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "serif",
    fontWeight: "bold",
  },
});

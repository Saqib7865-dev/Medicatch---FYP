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
  const { user } = useAppContext();
  const params = useLocalSearchParams();
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState("");

  const getFeedbacks = async () => {
    try {
      const resp = await fetch(
        `http://192.168.0.115:3001/feedback/${params._id}`
      );
      const data = await resp.json();
      setFeedbacks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const postFeedback = async () => {
    if (!newFeedback.trim()) {
      Alert.alert("Error", "Feedback cannot be empty.");
      return;
    }
    try {
      const resp = await fetch(
        `http://192.168.0.115:3001/feedback/${params._id}`,
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
        getFeedbacks(); // Refresh feedbacks after posting
      }
    } catch (error) {
      Alert.alert("Error", "Failed to post feedback.");
      console.error(error);
    }
  };

  useEffect(() => {
    getFeedbacks();
  }, []);

  const handleDeleteArticle = () => {
    Alert.alert(
      "Delete Article",
      "Are you sure you want to delete this article?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => console.log("Delete article logic") },
      ]
    );
  };

  const handleEditArticle = () => {
    router.push({
      pathname: "/Screens/EditArticle",
      params: { articleId: params.articleId },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <Image source={{ uri: params.image }} style={styles.articleImage} />
      <Text style={styles.title}>{params.title}</Text>
      <Text style={styles.date}>{formatDate(params.createdAt)}</Text>
      <Text style={styles.content}>{params.content}</Text>

      {/* {"admin" === "admin" && (
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
      )} */}

      {/* Feedback Section */}
      <View style={styles.feedbackSection}>
        <Text style={styles.feedbackHeader}>Feedbacks</Text>
        <FlatList
          data={feedbacks}
          keyExtractor={(item) => item._id.toString()} // Corrected keyExtractor to match _id
          renderItem={({ item }) => (
            <View style={styles.feedbackCard}>
              <Text style={styles.feedbackUser}>
                {item.userId.username} says:
              </Text>{" "}
              <Text style={styles.feedbackText}>{item.feedback}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.noFeedbackText}>
              No feedbacks available. Be the first to leave one!
            </Text>
          }
        />
        <TextInput
          style={styles.feedbackInput}
          placeholder="Write your feedback..."
          value={newFeedback}
          onChangeText={setNewFeedback}
        />
        <TouchableOpacity style={styles.submitButton} onPress={postFeedback}>
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ArticleDetails;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#c6e6f3",
  },
  backButton: {
    marginBottom: 20,
  },
  articleImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  adminActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  feedbackSection: {
    marginTop: 20,
  },
  feedbackHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  feedbackCard: {
    backgroundColor: "#fff",
    padding: 10,
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
    fontWeight: "bold",
    marginBottom: 5,
  },
  feedbackText: {
    fontSize: 14,
    color: "#555",
  },
  noFeedbackText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 10,
  },
  feedbackInput: {
    padding: 10,
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
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

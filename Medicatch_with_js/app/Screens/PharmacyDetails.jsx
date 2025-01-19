import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const PharmacyDetails = () => {
  const params = useLocalSearchParams();
  const router = useRouter();

  const handleUploadStock = () => {
    Alert.alert("Upload Stock", "Upload stock feature will be implemented.");
  };

  const handleUpdatePharmacy = () => {
    Alert.alert(
      "Update Pharmacy",
      "Update pharmacy feature will be implemented."
    );
  };

  const handleDeletePharmacy = () => {
    Alert.alert(
      "Delete Pharmacy",
      "Are you sure you want to delete this pharmacy?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => router.push("/Search") },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pharmacy Details</Text>
      <Text style={styles.detailText}>
        <Text style={styles.label}>Name:</Text> {params.pharmacyName}
      </Text>
      <Text style={styles.detailText}>
        <Text style={styles.label}>Owner:</Text> {params.ownerName}
      </Text>
      <Text style={styles.detailText}>
        <Text style={styles.label}>Contact:</Text> {params.contactNumber}
      </Text>
      <Text style={styles.detailText}>
        <Text style={styles.label}>Address:</Text> {params.address}
      </Text>
      <Text style={styles.detailText}>
        <Text style={styles.label}>Location:</Text> Latitude{" "}
        {params.location?.latitude}, Longitude {params.location?.longitude}
      </Text>

      <TouchableOpacity style={styles.actionButton} onPress={handleUploadStock}>
        <Text style={styles.buttonText}>Upload Stock File</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleUpdatePharmacy}
      >
        <Text style={styles.buttonText}>Update Pharmacy</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={handleDeletePharmacy}
      >
        <Text style={styles.buttonText}>Delete Pharmacy</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PharmacyDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#c6e6f3",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
  },
  actionButton: {
    backgroundColor: "#4173A1",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#D9534F",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

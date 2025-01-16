import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const Search = () => {
  const [pharmacyName, setPharmacyName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleRegister = () => {
    if (!pharmacyName || !ownerName || !contactNumber || !address) {
      setError("All fields are required!");
      return;
    }
    setError("");

    const formData = {
      pharmacyName,
      ownerName,
      contactNumber,
      address,
    };

    console.log("Pharmacy Details:", formData);

    // Clear form after submission
    setPharmacyName("");
    setOwnerName("");
    setContactNumber("");
    setAddress("");
  };

  const handleSetLocation = () => {
    console.log("Set Location button pressed");
    // Navigation to the map screen will be handled later
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Register Pharmacy</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Pharmacy Name */}
      <Text style={styles.label}>Pharmacy Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Pharmacy Name"
        value={pharmacyName}
        onChangeText={setPharmacyName}
      />

      {/* Owner Name */}
      <Text style={styles.label}>Owner's Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Owner's Name"
        value={ownerName}
        onChangeText={setOwnerName}
      />

      {/* Contact Number */}
      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Contact Number"
        value={contactNumber}
        keyboardType="phone-pad"
        onChangeText={setContactNumber}
      />

      {/* Address */}
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter Pharmacy Address"
        value={address}
        multiline
        numberOfLines={4}
        onChangeText={setAddress}
      />

      {/* Set Location Button */}
      <TouchableOpacity
        style={styles.setLocationButton}
        onPress={handleSetLocation}
      >
        <Text style={styles.buttonText}>Set Location</Text>
      </TouchableOpacity>

      {/* Register Button */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#c6e6f3",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#D1D9E6",
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    height: 80,
  },
  errorText: {
    color: "#D9534F",
    fontSize: 14,
    marginBottom: 15,
    textAlign: "center",
  },
  setLocationButton: {
    backgroundColor: "#FF8C00",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: "#4173A1",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

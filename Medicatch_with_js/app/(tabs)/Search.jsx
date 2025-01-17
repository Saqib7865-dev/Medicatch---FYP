import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import PharmacyLocation from "../Screens/PharmacyLocation";

const Search = () => {
  const [pharmacyName, setPharmacyName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const handleSetLocation = () => {
    if (!pharmacyName || !ownerName || !contactNumber || !address) {
      Alert.alert("Error", "Please fill all fields before setting a location.");
      return;
    }
    setShowMap(true);
  };

  const handleLocationSelect = (latitude, longitude) => {
    setLocation({ latitude, longitude });
    setShowMap(false);
  };

  const handleShowInGoogleMaps = () => {
    if (location) {
      const googleMapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      Linking.openURL(googleMapsUrl).catch((err) =>
        console.error("Failed to open Google Maps:", err)
      );
    } else {
      Alert.alert("Error", "Location is not set!");
    }
  };

  const handleRegister = () => {
    if (!pharmacyName || !ownerName || !contactNumber || !address) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    if (!location) {
      Alert.alert("Error", "Please set the pharmacy location!");
      return;
    }

    const formData = {
      pharmacyName,
      ownerName,
      contactNumber,
      address,
      location,
    };

    console.log("Pharmacy Details:", formData);

    // Clear form after submission
    setPharmacyName("");
    setOwnerName("");
    setContactNumber("");
    setAddress("");
    setLocation(null);

    Alert.alert("Success", "Pharmacy registered successfully!");
  };

  return (
    <>
      {showMap ? (
        <PharmacyLocation
          onConfirm={(latitude, longitude) =>
            handleLocationSelect(latitude, longitude)
          }
        />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>Register Pharmacy</Text>

          <Text style={styles.label}>Pharmacy Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Pharmacy Name"
            value={pharmacyName}
            onChangeText={setPharmacyName}
          />

          <Text style={styles.label}>Owner's Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Owner's Name"
            value={ownerName}
            onChangeText={setOwnerName}
          />

          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Contact Number"
            value={contactNumber}
            keyboardType="phone-pad"
            onChangeText={setContactNumber}
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter Pharmacy Address"
            value={address}
            multiline
            numberOfLines={4}
            onChangeText={setAddress}
          />

          {/* Display Selected Location */}
          {location && (
            <Text style={styles.locationText}>
              Selected Location: Latitude {location.latitude}, Longitude{" "}
              {location.longitude}
            </Text>
          )}

          {/* Show in Google Maps Button */}
          {location && (
            <TouchableOpacity
              style={styles.showInGoogleMapsButton}
              onPress={handleShowInGoogleMaps}
            >
              <Text style={styles.buttonText}>Show in Google Maps</Text>
            </TouchableOpacity>
          )}

          {/* Set Location Button */}
          <TouchableOpacity
            style={styles.setLocationButton}
            onPress={handleSetLocation}
          >
            <Text style={styles.buttonText}>Set Location</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </>
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
  locationText: {
    fontSize: 14,
    color: "#007BFF",
    marginBottom: 15,
  },
  showInGoogleMapsButton: {
    backgroundColor: "#28A745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
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

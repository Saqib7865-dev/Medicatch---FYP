import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import PharmacyLocation from "../Screens/PharmacyLocation";
import { useAppContext } from "../context/context";
import { useRouter } from "expo-router";
import PharmacyDetails from "../components/PharmacyDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Search = () => {
  const { user, setUser } = useAppContext();
  const router = useRouter();

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

  const handleRegister = async () => {
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
      // Include the file metadata
    };

    console.log("Pharmacy Details:", formData);

    try {
      const resp = await fetch("http://192.168.0.105:3001/pharmacy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: pharmacyName,
          location,
          createdBy: user.id,
          contact: contactNumber,
          address: address,
        }),
      });

      const data = await resp.json();
      if (resp.ok) {
        console.log(data);
        setPharmacyName("");
        setOwnerName("");
        setContactNumber("");
        setAddress("");
        setLocation(null);
        Alert.alert("Success", "Pharmacy registered successfully!");
        setUser((prev) => {
          return {
            ...prev,
            role: "pharmacy",
          };
        });

        // await AsyncStorage.removeItem("authToken"); // Clear the token from storage
        // router.push("(auth)/Login");
      } else {
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }

    // Clear form after submission
  };

  // useEffect(() => {
  //   router.push("/Screens/PharmacyDetails");
  // }, []);

  return (
    <>
      {user?.role === "pharmacy" ? (
        <PharmacyDetails />
      ) : (
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

              {location && (
                <Text style={styles.locationText}>
                  Selected Location: Latitude {location.latitude}, Longitude{" "}
                  {location.longitude}
                </Text>
              )}

              <TouchableOpacity
                style={styles.setLocationButton}
                onPress={handleSetLocation}
              >
                <Text style={styles.buttonText}>Set Location</Text>
              </TouchableOpacity>

              {/* CSV Upload Button */}

              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegister}
              >
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </>
      )}
    </>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#e8f5fa",
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
  setLocationButton: {
    backgroundColor: "#FF8C00",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  csvButton: {
    backgroundColor: "#28A745",
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

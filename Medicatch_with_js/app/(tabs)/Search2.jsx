import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useAppContext } from "../context/context";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const MedicineSearch = () => {
  const { contextualMed } = useAppContext();

  const [medicineName, setMedicineName] = useState("");
  const [stores, setStores] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(true);

  const getLocation = async () => {
    try {
      setIsLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission Denied",
          "Please enable location services to use this feature."
        );
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Location Error",
        "Failed to retrieve your location. Please try again."
      );
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (userLocation && contextualMed !== "") {
      setMedicineName(contextualMed);
      searchMed(contextualMed);
    }
  }, [contextualMed]);

  async function searchMed(query) {
    if (!medicineName.trim()) {
      Alert.alert("Error", "Please enter a medicine name.");
      return;
    }

    if (!userLocation) {
      Alert.alert(
        "Location Unavailable",
        "Your location is required to perform this search."
      );
      return;
    }

    setIsLoading(true);
    try {
      const resp = await fetch(
        `http://192.168.18.8:3001/pharmacy/searchMedicine/?query=${query}`,
        {
          method: "POST",
        }
      );

      const data = await resp.json();

      if (resp.ok) {
        if (data?.message === "not found") {
          setStores([]); // Reset stores when no data is found
          Alert.alert(
            "No Results",
            "No stores found for the requested medicine."
          );
          return;
        }

        const transformedStores = data
          .filter((store) => store.pharmacy.quantity > 0) // Ensure stock exists
          .map((store, index) => ({
            id: index,
            name: store.pharmacy.pharmacyName,
            address: store.pharmacy.address,
            contact: store.pharmacy.contact,
            availability: "In Stock",
            medName: store.pharmacy.medicineName,
            quantity: store.pharmacy.quantity,
            latitude: store.pharmacy.location.latitude,
            longitude: store.pharmacy.location.longitude,

            distance: calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              store.pharmacy.location.latitude,
              store.pharmacy.location.longitude
            ),
          }));

        setStores(
          transformedStores.sort((a, b) => a.distance - b.distance) // Sort by distance
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch data from the server.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenGoogleMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps/?q=${latitude},${longitude}`;
    console.log(url);
    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "Failed to open Google Maps.")
    );
  };

  if (isLocating) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4173A1" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search Medicine Availability</Text>

      {/* Medicine Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter medicine name"
        value={medicineName}
        onChangeText={setMedicineName}
      />

      {/* Search Button */}
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => {
          searchMed(medicineName);
        }}
      >
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {/* Search Results */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#4173A1" />
      ) : (
        <FlatList
          data={stores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.storeCard}>
              <Text style={styles.storeName}>{item.name} </Text>
              <Text style={styles.storeDetails}>Medicine: {item.medName} </Text>
              <Text style={styles.storeDetails}>Address: {item.address}</Text>
              <Text style={styles.storeDetails}>Contact: {item.contact}</Text>
              <Text style={[styles.availability, styles.inStock]}>
                {item.quantity} {item.availability}
              </Text>
              <TouchableOpacity
                style={styles.locateButton}
                onPress={() =>
                  handleOpenGoogleMaps(item.latitude, item.longitude)
                }
              >
                <Text style={styles.locateButtonText}>Locate</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.noResultsText}>
              No stores found for the requested medicine.
            </Text>
          }
        />
      )}
    </View>
  );
};

export default MedicineSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#e8f5fa",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
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
  searchButton: {
    backgroundColor: "#4173A1",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  storeCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  storeDetails: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  availability: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
    color: "#fff",
  },
  locateButton: {
    backgroundColor: "#FF8C00",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  locateButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  noResultsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

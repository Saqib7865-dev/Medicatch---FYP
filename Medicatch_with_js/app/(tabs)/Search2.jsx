import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [medicineName, setMedicineName] = useState("");
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const userLocation = { latitude: 33.6844, longitude: 73.0479 };

  const searchMed = async () => {
    if (!medicineName.trim()) {
      Alert.alert("Error", "Please enter a medicine name.");
      return;
    }

    setIsLoading(true);
    try {
      const resp = await fetch(
        `http://172.16.100.30:3001/pharmacy/searchMedicine/?query=${medicineName}`,
        {
          method: "POST",
        }
      );
      const data = await resp.json();

      // Transform API response to match UI requirements
      const transformedStores = data.map((store) => ({
        id: store._id,
        name: store.name,
        address: store.address,
        contact: store.contact,
        availability: store.stock.some(
          (item) =>
            item.medicineName.toLowerCase() === medicineName.toLowerCase()
        )
          ? "In Stock"
          : "Out of Stock",
        latitude: store.location.latitude,
        longitude: store.location.longitude,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          store.location.latitude,
          store.location.longitude
        ),
      }));

      setStores(
        transformedStores.sort((a, b) => a.distance - b.distance) // Sort by distance
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch data from the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenGoogleMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps/?q=${latitude},${longitude}`;
    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "Failed to open Google Maps.")
    );
  };

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
      <TouchableOpacity style={styles.searchButton} onPress={searchMed}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {/* Search Results */}
      {isLoading ? (
        <Text style={styles.loadingText}>Searching...</Text>
      ) : (
        <FlatList
          data={stores}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.storeCard}>
              <Text style={styles.storeName}>{item.name}</Text>
              <Text style={styles.storeDetails}>{item.address}</Text>
              <Text style={styles.storeDetails}>{item.contact}</Text>
              <Text
                style={[
                  styles.availability,
                  item.availability === "In Stock"
                    ? styles.inStock
                    : styles.outOfStock,
                ]}
              >
                {item.availability}
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
    backgroundColor: "#c6e6f3",
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
  },
  inStock: {
    backgroundColor: "#4CAF50",
    color: "#fff",
  },
  outOfStock: {
    backgroundColor: "#F44336",
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

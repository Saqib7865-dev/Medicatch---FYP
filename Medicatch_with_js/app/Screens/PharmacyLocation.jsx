import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import "react-native-get-random-values";

const PharmacyLocation = ({ onConfirm }) => {
  const [region, setRegion] = useState(null); // Current map region
  const [selectedLocation, setSelectedLocation] = useState(null); // Marker location

  useEffect(() => {
    (async () => {
      // Request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      // Get current location with high accuracy
      let { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      setSelectedLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    })();
  }, []);

  const handleLocationSelect = (latitude, longitude) => {
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setSelectedLocation({ latitude, longitude });
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onConfirm(selectedLocation.latitude, selectedLocation.longitude);
    } else {
      Alert.alert("Error", "Please select a location before confirming.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Google Places Autocomplete */}
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          placeholder="Search for a location"
          onPress={(data, details = null) => {
            const { lat, lng } = details.geometry.location;
            handleLocationSelect(lat, lng);
          }}
          query={{
            key: "AIzaSyCUVQfI-8gQf0KrD9-tPVxNcTGwqlN-pNU", // Replace with your API key
            language: "en",
          }}
          fetchDetails={true}
          styles={{
            container: { flex: 0 },
            textInput: {
              backgroundColor: "#FFFFFF",
              height: 50,
              borderRadius: 5,
              paddingVertical: 5,
              paddingHorizontal: 10,
              marginHorizontal: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 2,
            },
          }}
        />
      </View>

      {/* Map View */}
      {region ? (
        <MapView
          style={styles.map}
          initialRegion={region}
          region={region}
          onPress={(event) => {
            const { latitude, longitude } = event.nativeEvent.coordinate;
            handleLocationSelect(latitude, longitude);
          }}
        >
          {/* Marker */}
          {selectedLocation && (
            <Marker
              draggable
              coordinate={selectedLocation}
              onDragEnd={(event) => {
                const { latitude, longitude } = event.nativeEvent.coordinate;
                handleLocationSelect(latitude, longitude);
              }}
              title="Selected Location"
            />
          )}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      )}

      {/* Confirm Button */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmLocation}
      >
        <Text style={styles.confirmButtonText}>Confirm Location</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PharmacyLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    position: "absolute",
    top: 10,
    width: "100%",
    zIndex: 10, // Ensure the search bar is above the map
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  confirmButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#4173A1",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
});

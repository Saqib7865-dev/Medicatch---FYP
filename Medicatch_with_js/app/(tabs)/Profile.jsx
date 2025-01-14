import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location"; // For location permission and fetching

const Profile = () => {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    (async () => {
      // Request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      // Get current location
      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      {region ? (
        <MapView style={styles.map} initialRegion={region}>
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="You are here"
            />
          )}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      )}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
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

import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { useAppContext } from "../context/context";
import * as FileSystem from "expo-file-system";

const PharmacyDetails = () => {
  const { user } = useAppContext();
  const params = useLocalSearchParams();
  const router = useRouter();
  const [csvFile, setCsvFile] = useState(null); // State to store selected CSV file
  const [pharmacy, setPharmacy] = useState({});
  const [loading, setLoading] = useState(false);

  console.log(user);

  const getPharmacy = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`http://172.16.100.30:3001/pharmacy/${user.id}`);
      const data = await resp.json();
      console.log(data, "pharm.............");
      if (resp.ok) {
        setPharmacy(data.pharmacy);
        setLoading(false);
      }
      console.log(data._id);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(pharmacy._id);

  const addPharmStock = async (csvFile) => {
    console.log("pharmstock");
    if (!csvFile || !csvFile.assets || csvFile.assets.length === 0) {
      console.error("No CSV file selected.");
      return;
    }

    try {
      // Create a new FormData instance
      const formData = new FormData();
      const fileUri = csvFile.assets[0].uri;
      const fileName = csvFile.assets[0].name;
      const fileType = csvFile.assets[0].mimeType;

      // Read the file as binary

      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Append the file to the FormData
      formData.append("file", {
        uri: fileUri,
        name: fileName,
        type: "text/csv",
      });

      // Make the fetch call
      const resp = await fetch(
        `http://172.16.100.30:3001/pharmacy/${pharmacy._id}/stock`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      const data = await resp.json();

      console.log("Response from server:");

      if (resp.ok) {
        Alert.alert("Success", "Stock uploaded successfully!");
      } else {
        Alert.alert("Error", data.message || "Failed to upload stock.");
      }
    } catch (error) {
      console.error("Error uploading stock:", error);
      Alert.alert("Error", "An error occurred while uploading stock.");
    }
  };

  const handleCSVUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "text/comma-separated-values", // Only allow CSV files
        copyToCacheDirectory: true,
      });
      console.log(result);

      if (!result.canceled) {
        setCsvFile(result);
        console.log("uploaded.................................");

        return result;
        // Alert.alert("Success", `CSV file selected: ${result.name}`);
      } else {
        Alert.alert("Cancelled", "No file selected.");
      }
    } catch (error) {
      console.error("Error selecting file:", error);
      Alert.alert("Error", "Failed to select file.");
    }
  };

  const handleUploadStock = () => {
    if (!csvFile) {
      Alert.alert("Error", "Please select a CSV file before uploading.");
      return;
    }
    Alert.alert(
      "Upload Stock",
      `Uploading ${csvFile.name}...\nFeature implementation pending.`
    );
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

  useEffect(() => {
    getPharmacy();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pharmacy Details</Text>
      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        <>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Name:</Text> {pharmacy?.name}
          </Text>

          <Text style={styles.detailText}>
            <Text style={styles.label}>Contact:</Text> {pharmacy?.contact}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Address:</Text> {pharmacy?.address}
          </Text>
          {/* <Text style={styles.detailText}>
            <Text style={styles.label}>Location:</Text> Latitude{" "}
            {params.location?.latitude}, Longitude {params.location?.longitude}
          </Text> */}

          {/* Select CSV File */}
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                handleCSVUpload().then((resp) => {
                  console.log(resp, "resp-----------------");
                  // addPharmStock(resp);
                });
              }}
            >
              <Text style={styles.buttonText}>
                {csvFile ? `File Selected: ${csvFile.name}` : "Select CSV File"}
              </Text>
            </TouchableOpacity>

            {/* Upload Stock Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                addPharmStock(csvFile);
              }}
            >
              <Text style={styles.buttonText}>Upload Stock File</Text>
            </TouchableOpacity>

            {/* Update Pharmacy Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleUpdatePharmacy}
            >
              <Text style={styles.buttonText}>Update Pharmacy</Text>
            </TouchableOpacity>

            {/* Delete Pharmacy Button */}
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDeletePharmacy}
            >
              <Text style={styles.buttonText}>Delete Pharmacy</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
  loading: {
    fontSize: 16,
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

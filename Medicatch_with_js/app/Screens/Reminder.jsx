import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

const daysOfWeek = ["SU", "M", "T", "W", "TR", "F", "S"];

const MedicationReminder = () => {
  const [medicineName, setMedicineName] = useState("");
  const [medicineType, setMedicineType] = useState("");
  const [medicineAmount, setMedicineAmount] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);

  const toggleDaySelection = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day)); // Deselect day
    } else {
      setSelectedDays([...selectedDays, day]); // Select day
    }
  };

  const handleSave = () => {
    if (!medicineName || !medicineType || !medicineAmount) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    Alert.alert("Success", "Medication reminder saved successfully!", [
      { text: "OK" },
    ]);
    // Add logic to save reminder (e.g., API call or local storage)
  };

  const handleDiscard = () => {
    setMedicineName("");
    setMedicineType("");
    setMedicineAmount("");
    setSelectedDays([]);
    Alert.alert("Discarded", "Your changes have been discarded.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Medication Reminder</Text>

      {/* Medicine Name */}
      <Text style={styles.label}>Enter Medicine Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Medicine Name"
        value={medicineName}
        onChangeText={setMedicineName}
      />

      {/* Medicine Type */}
      <Text style={styles.label}>Select Medicine Type:</Text>
      <TextInput
        style={styles.input}
        placeholder="Other"
        value={medicineType}
        onChangeText={setMedicineType}
      />

      {/* Medicine Amount */}
      <Text style={styles.label}>Enter Amount of medicine to be taken:</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount of Medicine taken"
        keyboardType="numeric"
        value={medicineAmount}
        onChangeText={setMedicineAmount}
      />

      {/* Days Selection */}
      <Text style={styles.label}>Select days for taking medication:</Text>
      <View style={styles.daysContainer}>
        {daysOfWeek.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDays.includes(day) ? styles.dayButtonSelected : null,
            ]}
            onPress={() => toggleDaySelection(day)}
          >
            <Text
              style={[
                styles.dayText,
                selectedDays.includes(day) ? styles.dayTextSelected : null,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Save and Discard Buttons */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.discardButton} onPress={handleDiscard}>
        <Text style={styles.buttonText}>Discard</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4173A1",
    backgroundColor: "#fff",
  },
  dayButtonSelected: {
    backgroundColor: "#4173A1",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4173A1",
  },
  dayTextSelected: {
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#4173A1",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  discardButton: {
    backgroundColor: "#D9534F",
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

export default MedicationReminder;

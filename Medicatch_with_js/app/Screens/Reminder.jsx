import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";

const daysOfWeek = ["SU", "M", "T", "W", "TR", "F", "S"];

const MedicationReminder = () => {
  const [medicineName, setMedicineName] = useState("");
  const [medicineType, setMedicineType] = useState("");
  const [medicineAmount, setMedicineAmount] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [errors, setErrors] = useState({});

  const toggleDaySelection = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day)); // Deselect day
    } else {
      setSelectedDays([...selectedDays, day]); // Select day
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!medicineName.trim())
      newErrors.medicineName = "Medicine name is required.";
    if (!medicineType.trim())
      newErrors.medicineType = "Medicine type is required.";
    if (
      !medicineAmount.trim() ||
      isNaN(medicineAmount) ||
      Number(medicineAmount) <= 0
    )
      newErrors.medicineAmount = "Enter a valid amount of medicine.";

    if (selectedDays.length === 0)
      newErrors.selectedDays = "Please select at least one day.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSave = () => {
    if (!validateForm()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fix the errors before saving.",
      });
      return;
    }

    const formData = {
      medicineName,
      medicineType,
      medicineAmount,
      selectedDays,
    };

    console.log("Form Data:", formData);

    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Medication reminder saved successfully!",
    });

    // Clear form after saving
    setMedicineName("");
    setMedicineType("");
    setMedicineAmount("");
    setSelectedDays([]);
    setErrors({});
  };

  const handleDiscard = () => {
    setMedicineName("");
    setMedicineType("");
    setMedicineAmount("");
    setSelectedDays([]);
    setErrors({});
    Toast.show({
      type: "info",
      text1: "Discarded",
      text2: "Your changes have been discarded.",
    });
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
      {errors.medicineName && (
        <Text style={styles.errorText}>{errors.medicineName}</Text>
      )}

      {/* Medicine Type */}
      <Text style={styles.label}>Select Medicine Type:</Text>
      <TextInput
        style={styles.input}
        placeholder="Other"
        value={medicineType}
        onChangeText={setMedicineType}
      />
      {errors.medicineType && (
        <Text style={styles.errorText}>{errors.medicineType}</Text>
      )}

      {/* Medicine Amount */}
      <Text style={styles.label}>Enter Amount of medicine to be taken:</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount of Medicine taken"
        keyboardType="numeric"
        value={medicineAmount}
        onChangeText={setMedicineAmount}
      />
      {errors.medicineAmount && (
        <Text style={styles.errorText}>{errors.medicineAmount}</Text>
      )}

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
      {errors.selectedDays && (
        <Text style={styles.errorText}>{errors.selectedDays}</Text>
      )}

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
    marginBottom: 5,
  },
  errorText: {
    color: "#D9534F",
    fontSize: 14,
    marginBottom: 10,
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

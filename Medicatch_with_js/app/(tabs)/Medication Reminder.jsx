import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import SendNotification from "../components/send-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNotification } from "../context/NotificationsContext";

const daysOfWeek = ["SU", "M", "T", "W", "TR", "F", "S"];

const MedicationReminder = () => {
  const [medicineName, setMedicineName] = useState("");
  const [medicineType, setMedicineType] = useState("");
  const [medicineAmount, setMedicineAmount] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [storage, setStorage] = useState("s");

  console.log(storage);

  const toggleDaySelection = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day)); // Deselect day
    } else {
      setSelectedDays([...selectedDays, day]); // Select day
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const scheduleNotifications = async (day) => {
    const dayIndex = daysOfWeek.indexOf(day);
    const now = new Date();
    const nextNotificationDate = new Date(now);
    nextNotificationDate.setHours(time.getHours(), time.getMinutes(), 0);
    nextNotificationDate.setDate(
      now.getDate() + ((dayIndex - now.getDay() + 7) % 7 || 7)
    );

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Time for your medicine: ${medicineName}`,
        body: `Take ${medicineAmount} of ${medicineType}.`,
      },
      trigger: {
        weekday: dayIndex + 1, // Expo uses 1 = Sunday, 7 = Saturday
        hour: time.getHours(),
        minute: time.getMinutes(),
        repeats: true,
      },
    });
  };

  const handleSave = async () => {
    if (!medicineName || !medicineType || !medicineAmount) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (!selectedDays.length) {
      Alert.alert("Error", "Please select at least one day.");
      return;
    }

    const newReminder = {
      id: Date.now().toString(),
      medicineName,
      medicineType,
      medicineAmount,
      selectedDays,
      time,
    };

    // Save notification schedules
    for (const day of selectedDays) {
      await scheduleNotifications(day);
    }

    setReminders((prevReminders) => [...prevReminders, newReminder]);
    Alert.alert("Success", "Medication reminder saved successfully!");

    // Clear input fields
    setMedicineName("");
    setMedicineType("");
    setMedicineAmount("");
    setSelectedDays([]);
    setTime(new Date());
  };

  const handleDeleteReminder = (id) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
    Alert.alert("Deleted", "The reminder has been deleted.");
  };

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("my-key", value);
    } catch (e) {
      Alert(e);
      // saving error
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("my-key");
      console.log(value);
      if (value !== null) {
        Alert(value);
        console.log(value);
        // value previously stored
      }
    } catch (e) {
      Alert(e);
      // error reading value
    }
  };
  // const { expoPushToken, notification, error } = useNotification();
  // if (error) {
  //   return (
  //     <>
  //       <p style={styles.center}>Error: {error.message}</p>
  //     </>
  //   );
  // }
  // console.log(JSON.stringify(notification, null, 2));
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Medication Reminder</Text>
      {/* <Text>
        Data: {JSON.stringify(notification?.request.content.data, null, 2)}
      </Text> */}
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
        placeholder="Tablet, Syrup, etc."
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

      {/* Time Picker */}
      <Text style={styles.label}>Select Time for Reminder:</Text>
      <TouchableOpacity
        style={styles.timePickerButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.timePickerText}>
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      {/* Reminder List */}
      <Text style={styles.header}>Set Reminders</Text>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reminderCard}>
            <Text style={styles.reminderText}>
              {item.medicineName} - {item.medicineType}
            </Text>
            <Text style={styles.reminderText}>
              {item.medicineAmount} | Time:{" "}
              {item.time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Text style={styles.reminderDays}>
              Days: {item.selectedDays.join(", ")}
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteReminder(item.id)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noRemindersText}>
            No reminders set. Add a new one!
          </Text>
        }
      />

      {/* <SendNotification /> */}

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          console.log("setting storage");
          storeData("Ahmad1");
        }}
      >
        <Text style={styles.buttonText}>Set Storage</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          console.log("getting storage");
          getData();
        }}
      >
        <Text style={styles.buttonText}>Get Storage</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MedicationReminder;

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
  timePickerButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#4173A1",
    alignItems: "center",
    marginBottom: 20,
  },
  timePickerText: {
    color: "#fff",
    fontSize: 16,
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
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

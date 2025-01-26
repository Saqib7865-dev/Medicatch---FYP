import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";

const MedicationReminder = () => {
  const [medicineDescription, setMedicineDescription] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [medicineName, setMedicineName] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [reminders, setReminders] = useState([]);

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const handleDeleteReminder = async (id) => {
    await Notifications.cancelScheduledNotificationAsync(id);
    setReminders(reminders.filter((reminder) => reminder.id !== id));
    Alert.alert("Deleted", "The reminder has been deleted.");
  };

  async function schedulePushNotification(seconds) {
    console.log("seconds are: ", seconds);
    if (medicineDescription === "") {
      Alert.alert("Alert", "Please provide description");
      return;
    }
    setTimeout(() => {
      Alert.alert("Success", "Reminder set successfully");
    }, 200);
    let reminderId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Medication Reminder",
        body: `${medicineDescription}`,
        data: {
          data: "Data goes here",
        },
      },
      trigger: {
        seconds: seconds,
        repeats: false,
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      },
    });
    const newReminder = {
      id: reminderId,
      medicineName,
      medicineDescription,
      time,
      date,
    };
    setReminders((prevReminders) => [...prevReminders, newReminder]);
  }
  const handleSetReminder = () => {
    if (date) {
      const selectedDate = date.toISOString().split("T")[0];
      const selectedDateTime = new Date(selectedDate);
      const currentDate = new Date();
      const currentDateOnly = new Date(currentDate.toISOString().split("T")[0]);
      const dateDifferenceInMilliseconds =
        selectedDateTime.getTime() - currentDateOnly.getTime();
      const dateDifferenceInSeconds = Math.floor(
        dateDifferenceInMilliseconds / 1000
      );
      const selectedTimeHours = time.getHours();
      const selectedTimeMinutes = time.getMinutes();
      const currentTimeHours = currentDate.getHours();
      const currentTimeMinutes = currentDate.getMinutes();
      const timeDifferenceInMilliseconds =
        (selectedTimeHours - currentTimeHours) * 3600000 +
        (selectedTimeMinutes - currentTimeMinutes) * 60000;
      const timeDifferenceInSeconds = Math.floor(
        timeDifferenceInMilliseconds / 1000
      );

      const totalDifferenceInSeconds =
        dateDifferenceInSeconds + timeDifferenceInSeconds;

      if (totalDifferenceInSeconds > 0) {
        schedulePushNotification(totalDifferenceInSeconds);
      } else {
        Alert.alert(
          "Invalid Date/Time",
          "Please select a future date and time."
        );
      }
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      onPress={handleSetReminder}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Medication Reminder</Text>
        <Text style={styles.label}>Enter Medicine Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Medicine Name"
          value={medicineName}
          onChangeText={setMedicineName}
        />
        <Text style={styles.label}>Enter Medicine Description:</Text>
        <TextInput
          style={styles.input}
          placeholder="Medicine Description"
          multiline={true}
          value={medicineDescription}
          onChangeText={setMedicineDescription}
        />
        <Text style={styles.label}>Select Time for Reminder</Text>
        <TouchableOpacity
          style={styles.timePickerButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.timePickerText}>
            {time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) {
                setTime(selectedTime);
              }
            }}
          />
        )}
        <View style={styles.datePickerContainer}>
          <Button
            title="Pick Date"
            style={styles.DateTimePickerContainer}
            onPress={() => setShowPicker(true)}
          />
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              minimumDate={new Date()}
              display="default"
              onChange={(event, selectedDate) => {
                if (event.type === "set" && selectedDate) {
                  setDate(selectedDate);
                }
                setShowPicker(false);
              }}
            />
          )}
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSetReminder}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Set Reminders</Text>
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reminderCard}>
              <Text style={styles.reminderText}>
                {item.medicineName} - {item.medicineDescription}
              </Text>
              <Text style={styles.reminderText}>
                Time:{" "}
                {item.time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default MedicationReminder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: "serif",
    padding: 20,
    backgroundColor: "#e8f5fa",
  },
  header: {
    marginTop: 20,
    fontSize: 24,
    fontFamily: "serif",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontFamily: "serif",
    marginTop: 10,
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
    fontFamily: "serif",
  },
  timePickerButton: {
    padding: 15,
    borderRadius: 10,
    fontFamily: "serif",
    backgroundColor: "#4173A1",
    alignItems: "center",
    marginBottom: 20,
  },
  timePickerText: {
    fontFamily: "serif",
    color: "#fff",
    fontSize: 16,
  },
  saveButton: {
    fontFamily: "serif",
    backgroundColor: "#4173A1",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 20,
  },
  buttonText: {
    fontFamily: "serif",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  reminderCard: {
    fontFamily: "serif",
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#D1D9E6",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  reminderText: {
    fontFamily: "serif",
    fontSize: 16,
    marginBottom: 5,
  },
  deleteButton: {
    fontFamily: "serif",
    backgroundColor: "#D9534F",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  noRemindersText: {
    fontFamily: "serif",
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
});

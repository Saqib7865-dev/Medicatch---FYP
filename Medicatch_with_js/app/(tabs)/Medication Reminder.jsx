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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";

const MedicationReminder = () => {
  const [medicineDescription, setMedicineDescription] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [medicineName, setMedicineName] = useState("");
  const [medicineAmount, setMedicineAmount] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [reminders, setReminders] = useState([]);

  // const handleTimeChange = (event, selectedTime) => {
  //   setShowTimePicker(false);
  //   if (selectedTime) {
  //     setTime(selectedTime);
  //   }
  // };

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
      // Extract date part (YYYY-MM-DD)
      const selectedDate = date.toISOString().split("T")[0];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const targetDate = new Date(selectedDate);
      const differenceInMilliseconds = targetDate - today;
      const dateDifferenceInSeconds = Math.floor(
        differenceInMilliseconds / 1000
      );
      // Extract time part (HH:mm:ss)
      const selectedTime = time.toISOString().split("T")[1].split(".")[0];
      console.log("dateDifferenceInSeconds: ", dateDifferenceInSeconds);
      console.log("selectedTime: ", selectedTime);
      // Combine date and time in the desired format
      const combinedDateTime = `${selectedDate}T${selectedTime}.000Z`;
      const pstTime = new Date(combinedDateTime);
      // Convert to Pakistan time using native JS
      const pstTimeString = pstTime.toLocaleString("en-US", {
        timeZone: "UTC",
      });
      console.log("psttime: ", pstTimeString);

      const pstDate = new Date(pstTimeString);
      // if (isNaN(pstDate)) {
      //   Alert.alert(
      //     "Error: Invalid Date, possibly due to incorrect timezone format"
      //   );
      //   return;
      // }
      // console.log("PST Date: ", pstDate);
      // console.log("pstDate: ", pstDate);
      const differenceInSeconds = Math.floor((pstDate - new Date()) / 1000);
      if (differenceInSeconds <= 0) {
        Alert.alert("Invalid Date", "Please select a future date and time.");
        return;
      }
      schedulePushNotification(5);
    }
  };
  return (
    <View style={styles.container}>
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
      {/* Time Picker */}
      <Text style={styles.label}>Select Date for Reminder</Text>
      <TouchableOpacity
        style={styles.timePickerButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.timePickerText}>
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </TouchableOpacity>{" "}
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) {
              console.log("selected time: ", selectedTime);
              setTime(selectedTime);
            }
          }}
        />
      )}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <Button title="Pick Date" onPress={() => setShowPicker(true)} />
        {showPicker && (
          <DateTimePicker
            value={date}
            style={{ fontFamily: "sans-serif" }}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              if (event.type === "set" && selectedDate) {
                console.log("Selected Date: ", selectedDate);
                setDate(selectedDate);
              }
              setShowPicker(false);
            }}
          />
        )}
      </View>
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => handleSetReminder(Number(medicineDescription))}
      >
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
              {item.medicineName} - {item.medicineDescription}
            </Text>
            <Text style={styles.reminderText}>
              Amount: {item.medicineAmount} | Time:{" "}
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
      {/* <SendNotification /> */}
      {/* <TouchableOpacity style={styles.deleteButton} onPress={() => {}}>
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
      </TouchableOpacity> */}
    </View>
  );
};

export default MedicationReminder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 100,

    fontFamily: "serif",
    padding: 20,
    backgroundColor: "#e8f5fa",
    // backgroundColor: "blue",
  },
  header: {
    // backgroundColor: "red",
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

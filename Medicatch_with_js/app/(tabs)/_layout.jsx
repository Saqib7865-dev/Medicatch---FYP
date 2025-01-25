import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Platform, StatusBar } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: fasle,
  }),
});

const Tabslayout = () => {
  const [expoPushToken, setExpoPushToken] = useState();
  useEffect(() => {
    // fetch expo push token
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );
  }, []);
  console.log("Token: ", expoPushToken);
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Tabs
        screenOptions={() => ({
          headerShown: false,
          tabBarStyle: {
            borderTopWidth: 0,
            height: 60,
          },
          tabBarActiveTintColor: "#4173A1",
          tabBarInactiveTintColor: "#B3B3B3",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
          tabBarIconStyle: {
            justifyContent: "center",
          },
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Entypo name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Medication Reminder"
          options={{
            title: "Medication Reminder",
            tabBarIcon: ({ color }) => (
              <FontAwesome name="bell" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Health Articles"
          options={{
            title: "Health Articles",
            tabBarIcon: ({ color }) => (
              <Entypo name="text-document-inverted" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Register"
          options={{
            title: "Register",
            tabBarIcon: ({ color }) => (
              <Entypo name="location-pin" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Search2"
          options={{
            title: "Search",
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="search" size={24} color={color} />
              // <AntDesign name="search1" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#ff231f7c",
    });
  }
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for push notification!");
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "project-id",
      })
    ).data;
    console.log(token);
  } else {
    alert("Must use physical device for push notifications");
  }
}

export default Tabslayout;

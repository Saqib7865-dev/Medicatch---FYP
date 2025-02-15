import React, { useEffect, useRef, useState } from "react";
import { Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Platform, StatusBar, View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { AntDesign } from "@expo/vector-icons";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
const Tabslayout = () => {
  const [expoPushToken, setExpoPushToken] = useState();
  const [notification, setNotification] = useState();
  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    // fetch expo push token
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });
    notificationListener.current =
      Notifications.addNotificationReceivedListener(async (notification) => {
        setNotification(notification);
        await Notifications.cancelScheduledNotificationAsync(
          notification.request.identifier
        );
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response received listener: ", response);
      });
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);
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
        {/* <Tabs.Screen
          name="Health Articles"
          options={{
            title: "Health Articles",
            tabBarIcon: ({ color }) => (
              <Entypo name="text-document-inverted" size={24} color={color} />
            ),
          }}
        /> */}
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
      {notification && (
        <View
          style={{
            backgroundColor: "white",
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: "black",
            position: "absolute",
            // bottom: 70,
            top: "50%",
            transform: "translate(0,-50%)",
            paddingVertical: 20,
            left: 10,
            right: 10,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10 }}>
            {notification && notification.request.content.title}
          </Text>
          <Text
            style={{
              fontWeight: "normal",
              fontSize: 18,
              marginBottom: 10,
              textAlign: "justify",
            }}
          >
            {notification && notification.request.content.body}
          </Text>
          <AntDesign
            style={{ position: "absolute", top: 10, right: 10 }}
            name="close"
            size={24}
            color="black"
            onPress={() => {
              setNotification(undefined);
            }}
          ></AntDesign>
        </View>
      )}
    </>
  );
};

async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Manage your health",
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
    tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: "3931274c-dc64-4624-a0ae-9708dcd25139",
    });
    token = tokenData.data;
    return token;
  } else {
    alert("Must use physical device for push notifications");
  }
}

export default Tabslayout;

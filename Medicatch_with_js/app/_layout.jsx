import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppProvider } from "./context/context";
import { NotificationProvider } from "./context/NotificationsContext";
import * as Notifications from "expo-notifications";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldShowAlert: true,
    shouldSetBadge: true,
  }),
});
const RootLayout = () => {
  return (
    <>
      <NotificationProvider>
        <AppProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <StatusBar
              translucent
              backgroundColor="transparent"
              barStyle="dark-content"
            />

            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="Screens" />
            </Stack>
          </SafeAreaView>
        </AppProvider>
      </NotificationProvider>
    </>
  );
};

export default RootLayout;

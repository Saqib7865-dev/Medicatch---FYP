import React from "react";
import { Stack } from "expo-router";
import { LogBox, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppProvider, useAppContext } from "./context/context";
const RootLayout = () => {
  LogBox.ignoreAllLogs();
  return (
    <>
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
    </>
  );
};

export default RootLayout;

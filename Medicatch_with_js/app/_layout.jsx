import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RootLayout = () => {
  const router = useRouter();
  // useEffect(() => {
  //   router.push("(auth)");
  // }, []);

  return (
    <>
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
    </>
  );
};

export default RootLayout;

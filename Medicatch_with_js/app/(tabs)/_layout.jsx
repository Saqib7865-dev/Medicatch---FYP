import React from "react";
import { Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StatusBar } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const Tabslayout = () => {
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
              <AntDesign name="search1" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default Tabslayout;

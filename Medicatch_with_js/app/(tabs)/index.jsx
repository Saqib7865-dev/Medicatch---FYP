import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";

const Home = () => {
  const [medicine, setMedicine] = useState("");
  const handleSearch = () => {};
  return (
    <ScrollView
      contentContainerStyle={{
        display: "flex",
        paddingVertical: 20,
        alignItems: "center",
        height: `${Dimensions.get("window").height}`,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 8,
            borderRightWidth: 0,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            width: "75%",
          }}
          placeholder="Search for medicine"
          value={medicine}
          onChangeText={(text) => setMedicine(text)}
          keyboardType="default"
        ></TextInput>
        <Link
          href="/"
          style={{
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 8,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderLeftWidth: 0,
            paddingHorizontal: 8,
            paddingVertical: 11,
            backgroundColor: "blue",
            color: "white",
            outline: "none",
          }}
          onPress={handleSearch}
        >
          <Text>Search</Text>
        </Link>
      </View>
      <View
        style={{
          borderWidth: 0,
          borderColor: "gray",
          borderRadius: 8,
          marginBottom: 8,
          width: `90%`,
          paddingHorizontal: 20,
          paddingVertical: 30,
          backgroundColor: "blue",
          outline: "none",
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            fontFamily: "sans",
            marginBottom: 50,
            color: "white",
          }}
        >
          Read Article
        </Text>
        <View>
          <Link href={"/Health Articles"}>
            <Text
              style={{
                color: "red",
                fontSize: 16,
                textAlign: "right",
                fontWeight: "bold",
              }}
            >
              Go to Articles
            </Text>
          </Link>
        </View>
      </View>
      <View
        style={{
          borderWidth: 0,
          borderColor: "gray",
          borderRadius: 8,
          marginBottom: 8,
          width: `90%`,
          paddingHorizontal: 20,
          paddingVertical: 30,
          backgroundColor: "blue",
          outline: "none",
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            fontFamily: "sans",
            marginBottom: 50,
            color: "white",
          }}
        >
          Read Article
        </Text>
        <View>
          <Link href={"/Health Articles"}>
            <Text
              style={{
                color: "red",
                fontSize: 16,
                textAlign: "right",
                fontWeight: "bold",
              }}
            >
              Go to Articles
            </Text>
          </Link>
        </View>
      </View>
      <View
        style={{
          borderWidth: 0,
          borderColor: "gray",
          borderRadius: 8,
          marginBottom: 8,
          width: `90%`,
          paddingHorizontal: 20,
          paddingVertical: 30,
          backgroundColor: "blue",
          outline: "none",
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            fontFamily: "sans",
            marginBottom: 50,
            color: "white",
          }}
        >
          Read Article
        </Text>
        <View>
          <Link href={"/Health Articles"}>
            <Text
              style={{
                color: "red",
                fontSize: 16,
                textAlign: "right",
                fontWeight: "bold",
              }}
            >
              Go to Articles
            </Text>
          </Link>
        </View>
      </View>
      <View
        style={{
          borderWidth: 0,
          borderColor: "gray",
          borderRadius: 8,
          marginBottom: 8,
          width: `90%`,
          paddingHorizontal: 20,
          paddingVertical: 30,
          backgroundColor: "blue",
          outline: "none",
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            fontFamily: "sans",
            marginBottom: 50,
            color: "white",
          }}
        >
          Read Article
        </Text>
        <View>
          <Link href={"/Health Articles"}>
            <Text
              style={{
                color: "red",
                fontSize: 16,
                textAlign: "right",
                fontWeight: "bold",
              }}
            >
              Go to Articles
            </Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({});

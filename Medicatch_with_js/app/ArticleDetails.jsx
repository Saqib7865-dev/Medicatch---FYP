import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
// import { fetch } from "expo/fetch";

const ArticleDetails = () => {
  const params = useLocalSearchParams();
  console.log("first111");
  console.log(fetch);
  // const [data , setData]

  // const getUser = async () => {
  //   try {
  //     const resp = await fetch("http://localhost:3000/users");
  //     const data = await resp.json();
  //     console.log("Data: ", data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
      }}
    >
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 32,
            textAlign: "left",
            marginBottom: 20,
          }}
        >
          {params.title}
        </Text>
        <Text
          style={{ fontSize: 16, textAlign: "justify", paddingHorizontal: 20 }}
        >
          {params.Content}
        </Text>
      </View>
    </ScrollView>
  );
};

export default ArticleDetails;

const styles = StyleSheet.create({});

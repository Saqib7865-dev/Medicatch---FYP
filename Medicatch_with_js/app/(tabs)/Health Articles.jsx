import { StyleSheet, Text, View, ScrollView, TextInput } from "react-native";
import { data } from "../data";
import React, { useState } from "react";
import { Link } from "expo-router";

const HealthArticles = () => {
  const [article, setArticle] = useState();
  const handleSearch = () => {
    // console.log("");
  };
  return (
    <>
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
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
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
            placeholder="Search for article"
            value={article}
            onChangeText={(text) => setArticle(text)}
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
              paddingVertical: 10,
              backgroundColor: "blue",
              color: "white",
              outline: "none",
            }}
            onPress={handleSearch}
          >
            <Text>Search</Text>
          </Link>
        </View>
        {data.map((card, index) => (
          <View
            key={index}
            style={{
              borderWidth: 1,
              borderColor: "black",
              borderRadius: 8,
              marginBottom: 8,
              width: `90%`,
              paddingHorizontal: 20,
              paddingVertical: 30,
              backgroundColor: "blue",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                fontFamily: "sans",
                marginBottom: 10,
                color: "white",
              }}
            >
              {card.title}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "normal",
                fontFamily: "sans-serif",
                textAlign: "justify",
                marginTop: 5,
                color: "white",
              }}
            >
              {card.Content.slice(0, 182)}....
              <Link
                href={{
                  pathname: "../ArticleDetails",
                  params: { title: card.title, Content: card.Content },
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", marginLeft: 10 }}
                >
                  Read more
                </Text>
              </Link>
            </Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
};

export default HealthArticles;

const styles = StyleSheet.create({});

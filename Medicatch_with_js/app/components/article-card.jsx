import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

const styles = StyleSheet.create({});

const ArticleCard = () => {
  return (
    <View
      style={[
        styles.contentContainerStyle,
        {
          borderWidth: 0,
          borderColor: "gray",
          borderRadius: 8,
          backgroundColor: "red",
          width: `100%`,
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: "",
          outline: "none",
        },
      ]}
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
  );
};

export default ArticleCard;

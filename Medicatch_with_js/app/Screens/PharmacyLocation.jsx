// import React from "react";
// import { View } from "react-native";

// const PharmacyLocation = () => {
//   return (
//     <View>
//       <Text>PharmacyLocation</Text>
//     </View>
//   );
// };

// export default PharmacyLocation;

import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const PharmacyLocation = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create New Article</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#c6e6f3",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#D1D9E6",
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#4173A1",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PharmacyLocation;

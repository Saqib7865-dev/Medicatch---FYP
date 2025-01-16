import AsyncStorage from "@react-native-async-storage/async-storage";

// Save the token
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem("authToken", token);
  } catch (error) {
    console.error("Failed to save token", error);
  }
};

// Get the token
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem("authToken");
  } catch (error) {
    console.error("Failed to retrieve token", error);
    return null;
  }
};

// Remove the token
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("authToken");
  } catch (error) {
    console.error("Failed to remove token", error);
  }
};

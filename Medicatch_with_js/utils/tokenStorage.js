import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Store token in AsyncStorage.
 * @param {string} token - Token to store
 */
export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem("authToken", token);
  } catch (error) {
    console.error("Error storing token:", error);
  }
};

/**
 * Get token from AsyncStorage.
 * @returns {Promise<string|null>} - Token if exists, else null
 */
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem("authToken");
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};

/**
 * Remove token from AsyncStorage.
 */
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("authToken");
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

/**
 * Check if a token exists.
 * @returns {Promise<boolean>} - True if token exists, false otherwise
 */
export const isAuthenticated = async () => {
  const token = await getToken();
  return !!token;
};

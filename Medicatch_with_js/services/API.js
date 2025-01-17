import { getToken } from "../utils/tokenStorage";

export const fetchWithAuth = async (url, options = {}) => {
  const token = await getToken();
  if (!token) throw new Error("Unauthorized: No token found.");

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  return fetch(url, { ...options, headers });
};

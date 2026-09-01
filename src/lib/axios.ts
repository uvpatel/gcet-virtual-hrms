import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // sends better-auth session cookie
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) window.location.href = "/sign-in";
    return Promise.reject(err);
  }
);
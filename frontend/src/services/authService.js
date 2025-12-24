import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

// check if email exists
export const checkEmailExists = (email) =>
  API.post("/check-email", { email });

// register user
export const registerUser = (data) =>
  API.post("/register", data);

// login user
export const loginUser = (data) =>
  API.post("/login", data);

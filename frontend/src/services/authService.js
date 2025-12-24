import axios from "axios";
import { API_BASE } from "../config/api";


const API = axios.create({
  baseURL: `${API_BASE}/api/auth`,
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

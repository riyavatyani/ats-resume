import axios from "axios";
import { API_BASE } from "../config/api";

export const createOrder = async () => {
  const res = await axios.post(
    `${API_BASE}/api/payment/create-order`
  );
  return res.data;
};

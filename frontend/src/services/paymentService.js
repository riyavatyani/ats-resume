import axios from "axios";

export const createOrder = async () => {
  const res = await axios.post("http://localhost:5000/api/payment/create-order");
  return res.data;
};

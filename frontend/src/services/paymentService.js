import axios from "axios";


export const createOrder = async () => {
  const res = await axios.post(
    `/api/payment/create-order`
  );
  return res.data;
};

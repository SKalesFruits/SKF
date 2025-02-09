import axios, { AxiosResponse } from "axios";
import { Order } from "../types";

export const orders = async (): Promise<Order[]> => {
  const response: AxiosResponse<Order[]> = await axios.get(
    "http://127.0.0.1:8000/api/orders"
  );
  return response.data;
};

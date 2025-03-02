import axios, { AxiosResponse } from "axios";
import { Order } from "../types";

export const orders = async (): Promise<Order[]> => {
  const response: AxiosResponse<Order[]> = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/api/orders`
  );
  return response.data;
};

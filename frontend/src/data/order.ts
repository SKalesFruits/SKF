import axios, { AxiosResponse } from "axios";
import { Order } from "../types";

export const orders = async (username?: string | null): Promise<Order[]> => {
  if (username === null || username === "") {
    const response: AxiosResponse<Order[]> = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/orders`
    );
    return response.data;
  } else {
    const response: AxiosResponse<Order[]> = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/fetchordersbyusername`,
      {
        username: username,
      }
    );
    return response.data;
  }
};

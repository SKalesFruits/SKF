import axios, { AxiosResponse } from "axios";
import { Order } from "../types";

export const fetchordersbyusername = async (
  username?: string | null
): Promise<Order[]> => {
  const response: AxiosResponse<Order[]> = await axios.post(
    `${process.env.REACT_APP_API_BASE_URL}/api/fetchordersbyusername`,
    {
      username: username,
    }
  );
  return response.data;
};

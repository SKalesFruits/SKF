import axios, { AxiosResponse } from "axios";
import { Reviews } from "../types";

export const reviews = async (): Promise<Reviews[]> => {
  const response: AxiosResponse<Reviews[]> = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/api/reviews`
  );
  return response.data;
};

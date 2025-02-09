import axios, { AxiosResponse } from "axios";
import { Reviews } from "../types";

export const reviews = async (): Promise<Reviews[]> => {
  const response: AxiosResponse<Reviews[]> = await axios.get(
    "http://127.0.0.1:8000/api/reviews"
  );
  return response.data;
};

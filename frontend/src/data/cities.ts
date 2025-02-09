import axios, { AxiosResponse } from "axios";
import { Cities } from "../types";

export const deliverycities = async (): Promise<Cities[]> => {
  const response: AxiosResponse<Cities[]> = await axios.get(
    "http://127.0.0.1:8000/api/cities"
  );
  return response.data;
};

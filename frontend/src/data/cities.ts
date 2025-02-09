import axios, { AxiosResponse } from "axios";
import { Cities } from "../types";

export const deliverycities = async (): Promise<Cities[]> => {
  const response: AxiosResponse<Cities[]> = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/api/cities`
  );
  return response.data;
};

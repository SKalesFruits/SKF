import axios, { AxiosResponse } from "axios";
import { Config } from "../types";

export const getConfigDetailsFromDB = async (): Promise<Config[]> => {
  const response: AxiosResponse<Config[]> = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/api/config`
  );
  return response.data;
};

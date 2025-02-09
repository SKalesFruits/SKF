import axios, { AxiosResponse } from "axios";
import { Product } from "../types";

export const categories = ["all", "tropical", "berries", "core", "exotic"];

export const products = async (): Promise<Product[]> => {
  const response: AxiosResponse<Product[]> = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/api/products`
  );
  console.log(response.data);
  return response.data;
};

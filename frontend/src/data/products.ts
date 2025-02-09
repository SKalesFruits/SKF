import axios, { AxiosResponse } from "axios";
import { Product } from "../types";

export const categories = ["all", "tropical", "berries", "core", "exotic"];

export const products = async (): Promise<Product[]> => {
  const response: AxiosResponse<Product[]> = await axios.get(
    "http://127.0.0.1:8000/api/products"
  );
  console.log(response.data);
  return response.data;
};

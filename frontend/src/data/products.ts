import axios, { AxiosResponse } from "axios";
import { Product } from "../types";
// export const products = [
//   {
//     id: 1,
//     name: "Fresh Strawberries",
//     price: 20.99,
//     image:
//       "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=800",
//     category: "berries",
//     description:
//       "Sweet and juicy strawberries, perfect for desserts or healthy snacking.",
//     seasonal: true,
//     stock: 5,
//     organic: true,
//   },
//   {
//     id: 2,
//     name: "Organic Bananas",
//     price: 12.59,
//     image:
//       "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=800",
//     category: "tropical",
//     description:
//       "Perfectly ripened organic bananas, rich in potassium and natural sweetness.",
//     seasonal: false,
//     stock: 5,
//     organic: true,
//   },
//   {
//     id: 3,
//     name: "Red Apples",
//     price: 3.49,
//     image:
//       "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&q=80&w=800",
//     category: "core",
//     description: "Crisp and sweet red apples, perfect for snacking or baking.",
//     seasonal: true,
//     stock: 5,
//     organic: false,
//   },
//   {
//     id: 4,
//     name: "Dragon Fruit",
//     price: 6.99,
//     image:
//       "https://images.unsplash.com/photo-1527325678964-54921661f888?auto=format&fit=crop&q=80&w=800",
//     category: "exotic",
//     description:
//       "Exotic dragon fruit with vibrant pink flesh and subtle sweetness.",
//     seasonal: true,
//     stock: 5,
//     organic: true,
//   },
//   {
//     id: 5,
//     name: "Fresh Blueberries",
//     price: 5.99,
//     image:
//       "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&q=80&w=800",
//     category: "berries",
//     description: "Plump and sweet blueberries, packed with antioxidants.",
//     seasonal: true,
//     stock: 5,
//     organic: true,
//   },
//   {
//     id: 6,
//     name: "Ripe Mangoes",
//     price: 4.49,
//     image:
//       "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800",
//     category: "tropical",
//     description:
//       "Sweet and juicy mangoes, perfect for smoothies or fresh eating.",
//     seasonal: true,
//     stock: 5,
//     organic: false,
//   },
//   {
//     id: 7,
//     name: "Green Apples",
//     price: 3.29,
//     image:
//       "https://images.unsplash.com/photo-1619546813872-89525ce89f00?auto=format&fit=crop&q=80&w=800",
//     category: "core",
//     description: "Tart and crispy green apples, great for cooking or snacking.",
//     seasonal: true,
//     stock: 5,
//     organic: true,
//   },
//   {
//     id: 8,
//     name: "Fresh Raspberries",
//     price: 6.49,
//     image:
//       "https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?auto=format&fit=crop&q=80&w=800",
//     category: "berries",
//     description: "Delicate and flavorful raspberries, perfect for desserts.",
//     seasonal: true,
//     organic: true,
//     stock: 5,
//   },
// ];

export const categories = ["all", "tropical", "berries", "core", "exotic"];

export const products = async (): Promise<Product[]> => {
  const response: AxiosResponse<Product[]> = await axios.get(
    "http://127.0.0.1:8000/api/shop/products"
  );
  console.log(response.data);
  return response.data;
};

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  seasonal: boolean;
  organic: boolean;
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface FilterState {
  category: string;
  seasonal: boolean;
  organic: boolean;
  priceRange: [number, number];
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "delivered" | "cancelled";
  customerName: string;
  customerEmail: string;
  address: string;
  createdAt: string;
  deliveryAgent?: string;
}

export interface DeliveryAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "available" | "busy";
  activeOrders: string[];
  completedOrders: number;
}

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
  buying_price: number;
  popularity: number;
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

export interface DeliveryAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "available" | "busy";
  activeOrders: string[];
  completedOrders: number;
}

export interface Order {
  orderId: string;
  userName: string;
  dateOfOrderPlaced: string;
  currentStatus: string;
  orderLocation: string;
  orderAddress: string;
  totalOrderAmount: number;
  items: Array<string>;
  fleetAssignedId: null;
  fleetAssignedName: null;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Cities {
  city: string;
  district: string;
  coordinates: Coordinates;
}

export interface Reviews {
  review_id: number;
  product_id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

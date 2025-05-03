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
  productcategory?: string;
}

export interface ProductSave {
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
  productcategories?: Array<Category>;
}

interface Category {
  image: string;
  id: number;
  name: string;
  value: string;
}

export interface StatsData {
  totalRevenue: number;
  activeOrders: number;
  totalProducts: number;
  totalProfit: number;
  totalRevenueChange: string;
  activeOrdersChange: string;
  totalProductsChange: string;
  totalProfitChange: string;
}

export interface UserDetails {
  _id: {
    $oid: string;
  };
  user_email: string;
  user_name: string;
  user_city: string;
  user_contact: string;
  user_address: string;
  user_pincode: string;
  user_password_hashed: string;
  is_admin: boolean;
  created_at: {
    $date: string;
  };
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
  reason: string;
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

export interface Config {
  _id: {
    $oid: string;
  };
  config_name: string;
  config_value: string | Array<string> | number;
}

export interface Reviews {
  review_id: number;
  product_id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

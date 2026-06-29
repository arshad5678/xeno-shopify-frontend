export interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  shopifyDomain: string;
  isActive: boolean;
  hasShopifyToken: boolean;
  createdAt: string;
  updatedAt: string;
  stats?: {
    customers: number;
    products: number;
    orders: number;
    users: number;
  };
}

export interface Customer {
  id: string;
  shopifyId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  totalSpent: number;
  ordersCount: number;
  acceptsMarketing: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  shopifyId: string;
  title: string;
  handle?: string;
  vendor?: string;
  productType?: string;
  price?: number;
  compareAtPrice?: number;
  status?: string;
  inventory: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  shopifyId: string;
  customerId?: string;
  orderNumber?: string;
  totalPrice: number;
  subtotalPrice?: number;
  totalTax?: number;
  totalDiscounts?: number;
  currency: string;
  financialStatus?: string;
  fulfillmentStatus?: string;
  orderDate: string;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  orderItems?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  title: string;
  quantity: number;
  price: number;
  total: number;
  createdAt: string;
  product?: Product;
}

export interface SyncLog {
  id: string;
  tenantId: string;
  type: "CUSTOMERS" | "PRODUCTS" | "ORDERS" | "FULL_SYNC";
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  message?: string;
  recordsProcessed: number;
  startedAt: string;
  completedAt?: string;
}

export interface DashboardOverview {
  totalCustomers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  recentOrdersCount: number;
  recentRevenue: number;
}

export interface ChartData {
  date: string;
  orders: number;
  revenue: number;
}

export interface TopCustomer {
  id: string;
  name: string;
  email?: string;
  totalSpent: number;
  ordersCount: number;
  averageOrderValue: number;
  acceptsMarketing: boolean;
}

export interface ProductPerformance {
  productId: string;
  title: string;
  vendor?: string;
  totalRevenue: number;
  totalQuantity: number;
  totalOrders: number;
  averageOrderQuantity: number;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomersThisMonth: number;
  customersWithOrders: number;
  customerConversionRate: number;
  avgOrdersPerCustomer: number;
}

export interface CustomerSegments {
  new: number;
  oneTime: number;
  repeat: number;
  loyal: number;
}

export interface SyncStatus {
  lastSync?: SyncLog;
  runningSyncs: number;
  recentSyncs: SyncLog[];
}

export interface SyncStatistics {
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  successRate: number;
  avgRecordsProcessed: number;
  lastSuccessfulSync?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
  tenantName: string;
  shopifyDomain: string;
}

export interface ShopifyConfigData {
  shopifyAccessToken: string;
  apiKey?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  details?: any;
}

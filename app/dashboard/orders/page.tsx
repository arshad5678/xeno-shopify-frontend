"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

interface Order {
  id: string;
  shopifyId: string;
  orderNumber: string;
  totalPrice: number;
  subtotalPrice: number;
  totalTax: number;
  totalDiscounts: number;
  currency: string;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  orderDate: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  orderItems: Array<{
    title: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          setError("Failed to fetch orders");
        }
      } catch (err) {
        setError("Error loading orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const getStatusColor = (
    status: string | null | undefined,
    type: "financial" | "fulfillment"
  ) => {
    if (!status) {
      return "bg-gray-100 text-gray-800";
    }

    if (type === "financial") {
      switch (status.toLowerCase()) {
        case "paid":
          return "bg-green-100 text-green-800";
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "refunded":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    } else {
      switch (status.toLowerCase()) {
        case "fulfilled":
          return "bg-green-100 text-green-800";
        case "partial":
          return "bg-yellow-100 text-yellow-800";
        case "unfulfilled":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/4 mb-8"></div>
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50"
                >
                  <div className="p-6 border-b border-gray-200/50">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48"></div>
                      </div>
                      <div className="space-y-2 text-right">
                        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                        <div className="flex space-x-2">
                          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-red-800 font-semibold">
                  Error Loading Orders
                </h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
                  Orders Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Track and manage all customer orders in one place
                </p>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.orderDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        • {order.customer.firstName} {order.customer.lastName}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
                        {order.currency} {order.totalPrice.toFixed(2)}
                      </div>
                      <div className="flex space-x-2 mt-1">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            order.financialStatus,
                            "financial"
                          )}`}
                        >
                          {order.financialStatus || "Unknown"}
                        </span>
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            order.fulfillmentStatus,
                            "fulfillment"
                          )}`}
                        >
                          {order.fulfillmentStatus || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="px-6 py-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Customer Information */}
                    <div className="bg-gray-50/50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {order.customer.firstName.charAt(0)}
                            {order.customer.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Customer Information
                          </h4>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 space-y-1">
                        <div className="font-medium">
                          {order.customer.firstName} {order.customer.lastName}
                        </div>
                        <div className="text-gray-600">
                          {order.customer.email}
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50/50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                          <span className="text-white text-lg">💰</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Order Summary
                          </h4>
                        </div>
                      </div>
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between text-gray-700">
                          <span>Subtotal:</span>
                          <span>
                            {order.currency} {order.subtotalPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                          <span>Tax:</span>
                          <span>
                            {order.currency} {order.totalTax.toFixed(2)}
                          </span>
                        </div>
                        {order.totalDiscounts > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount:</span>
                            <span>
                              -{order.currency}{" "}
                              {order.totalDiscounts.toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200">
                          <span>Total:</span>
                          <span>
                            {order.currency} {order.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  {order.orderItems && order.orderItems.length > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm">📦</span>
                        </div>
                        <h4 className="font-semibold text-gray-900">
                          Order Items ({order.orderItems.length})
                        </h4>
                      </div>
                      <div className="bg-gray-50/50 rounded-xl p-4 space-y-3">
                        {order.orderItems.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-600 text-xs font-medium">
                                  {item.quantity}x
                                </span>
                              </div>
                              <span className="font-medium text-gray-900">
                                {item.title}
                              </span>
                            </div>
                            <div className="font-semibold text-gray-900">
                              {order.currency} {item.total.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                    <button className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105">
                      📄 View Details
                    </button>
                    <button className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                      ✏️ Edit
                    </button>
                    <button className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                      🚚 Track
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {orders.length === 0 && (
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-12 text-center shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Orders Found
              </h3>
              <p className="text-gray-600 mb-6">
                Sync your Shopify store to import order data and start managing
                your orders.
              </p>
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200">
                🔄 Sync Orders
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { dashboardService } from "@/lib/api";
import { Users, Mail, DollarSign, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

interface Customer {
  id: string;
  name: string;
  email?: string;
  totalSpent: number;
  ordersCount: number;
  averageOrderValue: number;
  acceptsMarketing: boolean;
}

export function TopCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopCustomers();
  }, []);

  const loadTopCustomers = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getTopCustomers({ limit: 5 });
      setCustomers(response.data.customers);
    } catch (error) {
      console.error("Failed to load top customers:", error);
      toast.error("Failed to load top customers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-white to-indigo-50/30"></div>

      {/* Content */}
      <div className="relative p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-md">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Top Customers
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Highest spending customers
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4 p-3 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2"></div>
                  </div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">
              No customer data available
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {customers.map((customer, index) => {
              const getRankBadge = (rank: number) => {
                if (rank === 0) return "from-yellow-400 to-yellow-600"; // Gold
                if (rank === 1) return "from-gray-400 to-gray-600"; // Silver
                if (rank === 2) return "from-amber-600 to-amber-800"; // Bronze
                return "from-purple-500 to-indigo-600"; // Default
              };

              const getRankIcon = (rank: number) => {
                if (rank === 0) return "👑";
                if (rank === 1) return "🥈";
                if (rank === 2) return "🥉";
                return "#" + (rank + 1);
              };

              return (
                <div
                  key={customer.id}
                  className="group flex items-center space-x-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:bg-white/80 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 bg-gradient-to-r ${getRankBadge(
                        index
                      )} rounded-xl flex items-center justify-center shadow-md`}
                    >
                      <span className="text-white text-xs font-bold">
                        {getRankIcon(index)}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {customer.name || "Unknown Customer"}
                      </p>
                      {customer.acceptsMarketing && (
                        <div
                          className="flex items-center justify-center w-5 h-5 bg-green-100 rounded-full"
                          title="Accepts marketing"
                        >
                          <Mail className="h-3 w-3 text-green-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-1.5">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
                        <span className="text-xs text-gray-600 font-medium">
                          $
                          {customer.totalSpent.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                        <span className="text-xs text-gray-600 font-medium">
                          {customer.ordersCount} orders
                        </span>
                      </div>
                    </div>
                    {customer.email && (
                      <p className="text-xs text-gray-400 truncate mt-1">
                        {customer.email}
                      </p>
                    )}
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg px-3 py-1.5">
                      <p className="text-sm font-bold text-white">
                        $
                        {customer.averageOrderValue.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-indigo-100">avg order</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {customers.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200/50">
            <button className="w-full text-sm font-medium text-center py-2 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 hover:shadow-md">
              View all customers →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

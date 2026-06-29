"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { dashboardService } from "@/lib/api";
import { Calendar, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

interface ChartData {
  date: string;
  revenue: number;
  orders: number;
}

export function RevenueChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");

  useEffect(() => {
    loadChartData();
  }, [period]);

  const loadChartData = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = new Date();

      switch (period) {
        case "7d":
          startDate.setDate(endDate.getDate() - 7);
          break;
        case "90d":
          startDate.setDate(endDate.getDate() - 90);
          break;
        default: // 30d
          startDate.setDate(endDate.getDate() - 30);
      }

      const response = await dashboardService.getOrdersByDate({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        groupBy: period === "7d" ? "day" : period === "90d" ? "week" : "day",
      });

      setData(response.data.data);
    } catch (error) {
      console.error("Failed to load chart data:", error);
      toast.error("Failed to load chart data");
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);

  return (
    <div className="relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/30"></div>

      {/* Content */}
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-md">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Revenue Trends
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Daily revenue and order volume insights
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 font-medium cursor-pointer"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="h-72 flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3 animate-pulse">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div className="text-sm text-gray-500 font-medium">
                Loading chart data...
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-5 text-white shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold">
                      $
                      {totalRevenue.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-indigo-100 font-medium text-sm mt-1">
                      Total Revenue
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {totalOrders.toLocaleString()}
                    </p>
                    <p className="text-purple-100 font-medium text-sm mt-1">
                      Total Orders
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-gray-200/50 shadow-sm">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      opacity={0.3}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.getMonth() + 1 + "/" + date.getDate();
                      }}
                      axisLine={{ stroke: "#d1d5db" }}
                      tickLine={{ stroke: "#d1d5db" }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                      axisLine={{ stroke: "#d1d5db" }}
                      tickLine={{ stroke: "#d1d5db" }}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "revenue"
                          ? `$${value.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}`
                          : value.toLocaleString(),
                        name === "revenue" ? "Revenue" : "Orders",
                      ]}
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString();
                      }}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid rgba(209, 213, 219, 0.3)",
                        borderRadius: "8px",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(10px)",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="url(#colorGradient)"
                      strokeWidth={2.5}
                      dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
                      activeDot={{
                        r: 6,
                        fill: "#4f46e5",
                        stroke: "#ffffff",
                        strokeWidth: 2,
                      }}
                    />
                    <defs>
                      <linearGradient
                        id="colorGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import {
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface OverviewData {
  totalCustomers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  recentOrdersCount: number;
  recentRevenue: number;
}

interface OverviewCardsProps {
  data: OverviewData;
}

export function OverviewCards({ data }: OverviewCardsProps) {
  const cards = [
    {
      title: "Total Revenue",
      value: `$${data.totalRevenue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      change:
        data.recentRevenue > 0
          ? `+$${data.recentRevenue.toLocaleString()}`
          : "$0",
      changeType: data.recentRevenue > 0 ? "increase" : "neutral",
      subtitle: "Last 30 days",
    },
    {
      title: "Total Orders",
      value: data.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      change: data.recentOrdersCount > 0 ? `+${data.recentOrdersCount}` : "0",
      changeType: data.recentOrdersCount > 0 ? "increase" : "neutral",
      subtitle: "Last 30 days",
    },
    {
      title: "Total Customers",
      value: data.totalCustomers.toLocaleString(),
      icon: Users,
      change: `${Math.round(
        (data.totalCustomers / Math.max(data.totalOrders, 1)) * 100
      )}%`,
      changeType: "neutral",
      subtitle: "Customer rate",
    },
    {
      title: "Avg. Order Value",
      value: `$${data.averageOrderValue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })}`,
      icon: Package,
      change: data.averageOrderValue > 50 ? "Above avg" : "Below avg",
      changeType: data.averageOrderValue > 50 ? "increase" : "decrease",
      subtitle: "Per order",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 ease-out"
          style={{
            animationDelay: `${index * 100}ms`,
            animation: "fadeInUp 0.6s ease-out forwards",
          }}
        >
          {/* Gradient background overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div
                  className={`p-3 rounded-xl shadow-lg ${
                    index === 0
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                      : index === 1
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                      : index === 2
                      ? "bg-gradient-to-r from-purple-500 to-pink-600"
                      : "bg-gradient-to-r from-orange-500 to-red-600"
                  }`}
                >
                  <card.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {card.changeType === "increase" && (
                  <div className="flex items-center px-2 py-1 bg-green-100 rounded-full">
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    <span className="text-xs font-semibold text-green-700">
                      {card.change}
                    </span>
                  </div>
                )}
                {card.changeType === "decrease" && (
                  <div className="flex items-center px-2 py-1 bg-red-100 rounded-full">
                    <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                    <span className="text-xs font-semibold text-red-700">
                      {card.change}
                    </span>
                  </div>
                )}
                {card.changeType === "neutral" && (
                  <div className="flex items-center px-2 py-1 bg-gray-100 rounded-full">
                    <span className="text-xs font-semibold text-gray-700">
                      {card.change}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                {card.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-2 mb-1">
                {card.value}
              </p>
              <p className="text-xs text-gray-500 font-medium">
                {card.subtitle}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

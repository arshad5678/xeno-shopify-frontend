"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TopCustomers } from "@/components/dashboard/TopCustomers";
import ProductPerformance from "@/components/dashboard/ProductPerformance";
import SyncStatus from "@/components/dashboard/SyncStatus";
import { dashboardService } from "@/lib/api";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface DashboardData {
  overview: any;
  topProducts: any[];
  syncLogs: any[];
}

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user, tenant } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getOverview();
      setDashboardData(response.data);
    } catch (error: any) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
              <span className="text-white font-bold text-xl">X</span>
            </div>
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md" />
          </div>
          <p className="text-gray-700 font-medium mt-4">
            Loading your dashboard...
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Getting everything ready for you
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl blur-3xl"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, {user?.name}! 👋
              </h1>
              <div className="flex items-center mt-3 space-x-2">
                <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full border border-indigo-100">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium text-indigo-700">
                    {tenant?.name}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600 font-medium">
                  {tenant?.shopifyDomain}
                </span>
              </div>
            </div>
            <SyncStatus syncLogs={dashboardData?.syncLogs || []} />
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      {dashboardData && (
        <>
          <div className="transform transition-all duration-500 ease-out">
            <OverviewCards data={dashboardData.overview} />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="transform transition-all duration-500 ease-out delay-100">
              <RevenueChart />
            </div>
            <div className="transform transition-all duration-500 ease-out delay-200">
              <TopCustomers />
            </div>
          </div>

          {/* Product Performance */}
          <div className="transform transition-all duration-500 ease-out delay-300">
            <ProductPerformance products={dashboardData?.topProducts || []} />
          </div>
        </>
      )}
    </div>
  );
}

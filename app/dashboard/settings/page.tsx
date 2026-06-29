"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

interface Tenant {
  id: string;
  name: string;
  shopifyDomain: string;
  isActive: boolean;
  createdAt: string;
}

interface ConnectionStatus {
  success: boolean;
  data?: any;
  error?: string;
}

export default function SettingsPage() {
  const { token, user } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    shopifyDomain: "",
    isActive: true,
  });

  const [shopifyConfig, setShopifyConfig] = useState({
    shopifyAccessToken: "",
    shopifyDomain: "",
  });

  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus | null>(null);

  useEffect(() => {
    const fetchTenant = async () => {
      if (!token) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tenant`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setTenant(data);
          setFormData({
            name: data.name,
            shopifyDomain: data.shopifyDomain || "",
            isActive: data.isActive,
          });
          setShopifyConfig({
            shopifyAccessToken: "",
            shopifyDomain: data.shopifyDomain || "",
          });
        }
      } catch (err) {
        console.error("Error fetching tenant:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setUpdating(true);
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tenant`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const updatedTenant = await response.json();
        setTenant(updatedTenant);
        setMessage("Settings updated successfully!");
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (err) {
      setMessage("Error updating settings. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleShopifyConfigChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setShopifyConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTestConnection = async () => {
    if (!token || !shopifyConfig.shopifyAccessToken) return;

    setTestingConnection(true);
    setConnectionStatus(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tenants/test-shopify`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setConnectionStatus({ success: true, data: result });
      } else {
        const error = await response.json();
        setConnectionStatus({ success: false, error: error.error });
      }
    } catch (err) {
      setConnectionStatus({ success: false, error: "Connection test failed" });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveShopifyConfig = async () => {
    if (!token) return;

    setUpdating(true);
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tenants/shopify-config`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(shopifyConfig),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setMessage("Shopify configuration saved successfully!");
        setConnectionStatus({ success: true, data: result });
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
      }
    } catch (err) {
      setMessage("Error saving Shopify configuration. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <div className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6"
                  >
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3 mb-6"></div>
                    <div className="space-y-4">
                      {[...Array(3)].map((_, j) => (
                        <div
                          key={j}
                          className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                      <div className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
                    </div>
                  ))}
                </div>
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
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
                Settings & Configuration
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your store settings, account information, and Shopify
                integration
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Store Settings */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">⚙️</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Store Configuration
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Store Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="shopifyDomain"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Shopify Domain
                  </label>
                  <input
                    type="text"
                    id="shopifyDomain"
                    name="shopifyDomain"
                    value={formData.shopifyDomain}
                    onChange={handleInputChange}
                    placeholder="your-store.myshopify.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                  />
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                    <span className="text-blue-500">💡</span>
                    Your Shopify store domain (without https://)
                  </p>
                </div>

                <div className="bg-gray-50/50 rounded-xl p-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isActive"
                      className="ml-3 block text-sm font-medium text-gray-900"
                    >
                      🟢 Store is active and operational
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  {updating ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </div>
                  ) : (
                    "💾 Update Settings"
                  )}
                </button>
              </form>

              {message && (
                <div
                  className={`mt-4 p-4 rounded-xl border ${
                    message.includes("successfully")
                      ? "bg-green-50 text-green-800 border-green-200"
                      : "bg-red-50 text-red-800 border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {message.includes("successfully") ? "✅" : "❌"}
                    </span>
                    {message}
                  </div>
                </div>
              )}
            </div>

            {/* Account Information */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">👤</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Account Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    User Email
                  </label>
                  <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl text-gray-900 font-medium">
                    {user?.email || "Not available"}
                  </div>
                </div>

                {tenant && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tenant ID
                      </label>
                      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl text-gray-900 font-mono text-sm break-all">
                        {tenant.id}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Created At
                      </label>
                      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl text-gray-900">
                        {new Date(tenant.createdAt).toLocaleString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Store Status
                      </label>
                      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-full ${
                            tenant.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          <span>{tenant.isActive ? "🟢" : "🔴"}</span>
                          {tenant.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Shopify Integration */}
          <div className="mt-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🛍️</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Shopify Integration
              </h2>
            </div>

            {/* Shopify Configuration Form */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-sm">🔑</span>
                API Configuration
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="shopifyDomain"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Shopify Store Domain
                  </label>
                  <input
                    type="text"
                    id="shopifyDomain"
                    name="shopifyDomain"
                    value={shopifyConfig.shopifyDomain}
                    onChange={handleShopifyConfigChange}
                    placeholder="your-store.myshopify.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="shopifyAccessToken"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Admin API Access Token
                  </label>
                  <input
                    type="password"
                    id="shopifyAccessToken"
                    name="shopifyAccessToken"
                    value={shopifyConfig.shopifyAccessToken}
                    onChange={handleShopifyConfigChange}
                    placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                  />
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                    <span className="text-blue-500">💡</span>
                    Get this from your Shopify Admin → Apps → Develop apps →
                    [Your App] → API credentials
                  </p>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={
                      testingConnection || !shopifyConfig.shopifyAccessToken
                    }
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    {testingConnection ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Testing...
                      </div>
                    ) : (
                      "🔍 Test Connection"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveShopifyConfig}
                    disabled={updating || !shopifyConfig.shopifyAccessToken}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    {updating ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </div>
                    ) : (
                      "💾 Save Configuration"
                    )}
                  </button>
                </div>

                {connectionStatus && (
                  <div
                    className={`mt-4 p-4 rounded-xl border ${
                      connectionStatus.success
                        ? "bg-green-50 text-green-800 border-green-200"
                        : "bg-red-50 text-red-800 border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {connectionStatus.success ? "✅" : "❌"}
                      </span>
                      {connectionStatus.success
                        ? `Connected successfully! ${
                            connectionStatus.data?.shop?.name || ""
                          }`
                        : `Connection failed: ${connectionStatus.error}`}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-sm">🔗</span>
                  Connection Status
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">
                      API Connection
                    </span>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full ${
                        connectionStatus?.success
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <span>{connectionStatus?.success ? "🟢" : "🔴"}</span>
                      {connectionStatus?.success
                        ? "Connected"
                        : "Not Connected"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">
                      Store Domain
                    </span>
                    <span className="text-sm text-gray-600 font-medium">
                      {tenant?.shopifyDomain || "Not configured"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-sm">⚡</span>
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() =>
                      window.open(
                        `https://${tenant?.shopifyDomain}/admin`,
                        "_blank"
                      )
                    }
                    disabled={!tenant?.shopifyDomain}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 disabled:from-gray-100 disabled:to-gray-100 disabled:text-gray-400 border border-gray-200 rounded-xl transition-all duration-200 hover:scale-105 text-gray-700"
                  >
                    <span className="text-lg">🏪</span>
                    Open Shopify Admin
                  </button>

                  <button
                    onClick={() => (window.location.href = "/dashboard/sync")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border border-purple-200 rounded-xl transition-all duration-200 hover:scale-105 text-purple-700"
                  >
                    <span className="text-lg">🔄</span>
                    Sync Data Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

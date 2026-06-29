"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, TrendingDown } from "lucide-react";

interface Product {
  id: string;
  title: string;
  vendor: string;
  productType: string;
  tags: string[];
  totalSales: number;
  revenue: number;
  inventoryQuantity: number;
  status: string;
}

interface ProductPerformanceProps {
  products: Product[];
}

export default function ProductPerformance({
  products,
}: ProductPerformanceProps) {
  const topProducts = products
    .filter((product) => product.totalSales > 0)
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Top Performing Products
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No product sales data available</p>
            </div>
          ) : (
            topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-600">
                      #{index + 1}
                    </span>
                    <h3 className="font-medium text-gray-900 truncate">
                      {product.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {product.vendor}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {product.productType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {product.totalSales} sales
                    </span>
                    <span>Revenue: {formatCurrency(product.revenue)}</span>
                    <span
                      className={`flex items-center gap-1 ${
                        product.inventoryQuantity <= 10
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {product.inventoryQuantity <= 10 ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : (
                        <TrendingUp className="h-3 w-3" />
                      )}
                      Stock: {product.inventoryQuantity}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg text-gray-900">
                    {formatCurrency(product.revenue)}
                  </div>
                  <Badge
                    variant={
                      product.status === "active" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {product.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

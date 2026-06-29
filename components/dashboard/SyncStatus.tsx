"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface SyncLogEntry {
  id: string;
  operation: string;
  status: "success" | "error" | "in_progress";
  recordsProcessed: number;
  errorMessage?: string;
  createdAt: string;
}

interface SyncStatusProps {
  syncLogs: SyncLogEntry[];
  isLoading?: boolean;
}

export default function SyncStatus({
  syncLogs,
  isLoading = false,
}: SyncStatusProps) {
  const recentLogs = syncLogs.slice(0, 10);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <RefreshCw
              className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
            />
            Sync Status
          </CardTitle>
          {isLoading && (
            <Badge className="bg-blue-100 text-blue-800">Syncing...</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No sync history available</p>
            </div>
          ) : (
            recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(log.status)}
                  <div>
                    <div className="font-medium text-gray-900">
                      {log.operation}
                    </div>
                    <div className="text-sm text-gray-600">
                      {log.recordsProcessed} records processed
                    </div>
                    {log.errorMessage && (
                      <div className="text-sm text-red-600 mt-1">
                        {log.errorMessage}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDateTime(log.createdAt)}
                    </div>
                  </div>
                </div>
                <div>{getStatusBadge(log.status)}</div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

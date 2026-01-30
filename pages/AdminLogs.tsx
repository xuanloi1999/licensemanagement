import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Card, Input, Badge, Button } from "../components/UI";
import AuditLogService, { AuditLog } from "../services/AuditLogService";

export const AdminLogs: React.FC = () => {
  // Data state
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const itemsPerPage = 20;

  // Fetch logs from API
  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: {
        limit: number;
        offset: number;
        action?: string;
        actor?: string;
        resource?: string;
      } = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      };

      // Add filters if set
      if (typeFilter !== "All") {
        params.action = typeFilter;
      }

      const response = await AuditLogService.list(params);
      const data = response.data;

      setLogs(data.data || []);
      setTotalRecords(data.total || data.data?.length || 0);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load audit logs.";
      setError(errorMessage);
      console.error("Failed to fetch audit logs:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, typeFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Client-side filtering for search and date (API might not support these)
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        !searchTerm ||
        log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.resource?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false);

      const matchesDate =
        !dateFilter ||
        log.timestamp?.includes(dateFilter) ||
        log.created_at?.includes(dateFilter);

      return matchesSearch && matchesDate;
    });
  }, [logs, searchTerm, dateFilter]);

  // Export logs handler
  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Fetch all logs for export (or a reasonable limit)
      const response = await AuditLogService.list({ limit: 1000, offset: 0 });
      const allLogs = response.data.data || [];

      // Convert to CSV
      const headers = ["Timestamp", "Actor", "Action", "Resource", "Details"];
      const csvContent = [
        headers.join(","),
        ...allLogs.map((log) =>
          [
            log.timestamp || log.created_at || "",
            log.actor,
            log.action,
            log.resource || "",
            JSON.stringify(log.details || "").replace(/,/g, ";"),
          ].join(",")
        ),
      ].join("\n");

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `audit-logs-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to export logs.";
      alert(`Export failed: ${errorMessage}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setTypeFilter("All");
    setDateFilter("");
    setCurrentPage(1);
  };

  // Retry fetch
  const handleRetry = () => {
    fetchLogs();
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  // Loading state
  if (isLoading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-neutral-800 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-neutral-500 text-sm font-medium">
            Loading audit logs...
          </p>
        </div>
      </div>
    );
  }

  // Error state (blocking)
  if (error && logs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white">
            Failed to load audit logs
          </h3>
          <p className="text-neutral-500 text-sm">{error}</p>
          <Button onClick={handleRetry} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">
            System Audit Logs
          </h1>
          <p className="text-neutral-400 text-sm">
            Immutable ledger of administrative actions and platform events
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={isExporting || logs.length === 0}
          className="flex items-center gap-2 disabled:opacity-50"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export Logs
            </>
          )}
        </Button>
      </div>

      {/* Error Banner (non-blocking) */}
      {error && logs.length > 0 && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="text-sm text-yellow-400">
                Failed to refresh data. {error}
              </span>
            </div>
            <Button
              variant="ghost"
              onClick={handleRetry}
              className="!py-1.5 !px-3 !text-[10px]"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4 flex flex-wrap gap-4 items-end bg-background-darker/40 border-neutral-800">
        <div className="flex-1 min-w-[200px]">
          <Input
            label="Search Records"
            placeholder="Search by actor, action, or resource..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-52">
          <Input
            label="Filter by Date"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <div className="w-44">
          <label className="block text-xs font-medium text-neutral-400 mb-1">
            Action Category
          </label>
          <select
            className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-all"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Categories</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="login">Login</option>
            <option value="renew">Renewals</option>
            <option value="revoke">Revocations</option>
          </select>
        </div>
        <Button
          variant="ghost"
          onClick={handleResetFilters}
          className="mb-0.5 !py-2.5"
        >
          Reset
        </Button>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden border-neutral-800 shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-neutral-900/80 border-b border-neutral-800 backdrop-blur-md">
                <th className="px-8 py-5 font-bold text-neutral-500 uppercase tracking-widest text-[10px]">
                  Timestamp
                </th>
                <th className="px-8 py-5 font-bold text-neutral-500 uppercase tracking-widest text-[10px]">
                  Administrative Actor
                </th>
                <th className="px-8 py-5 font-bold text-neutral-500 uppercase tracking-widest text-[10px]">
                  Global Action
                </th>
                <th className="px-8 py-5 font-bold text-neutral-500 uppercase tracking-widest text-[10px]">
                  Resource
                </th>
                <th className="px-8 py-5 font-bold text-neutral-500 uppercase tracking-widest text-[10px]">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-neutral-700 border-t-primary rounded-full animate-spin" />
                      <span className="text-neutral-500">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-primary/5 transition-all group"
                  >
                    <td className="px-8 py-4 font-mono text-[11px] text-neutral-400 whitespace-nowrap group-hover:text-primary transition-colors">
                      {log.timestamp || log.created_at || "-"}
                    </td>
                    <td className="px-8 py-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-neutral-800 flex items-center justify-center text-[10px] border border-neutral-700">
                          {log.actor?.[0]?.toUpperCase() || "?"}
                        </div>
                        {log.actor}
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="px-3 py-1 rounded-full bg-neutral-950 text-neutral-400 text-[10px] font-bold border border-neutral-800 uppercase tracking-tighter group-hover:border-primary group-hover:text-primary transition-all">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-8 py-4 font-bold text-primary-200">
                      {log.resource || "-"}
                    </td>
                    <td className="px-8 py-4 text-neutral-400 italic text-xs max-w-xs truncate group-hover:text-neutral-200">
                      {typeof log.details === "object"
                        ? JSON.stringify(log.details)
                        : log.details || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-20 text-center text-neutral-600 italic"
                  >
                    No records found matching your specified filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalRecords > 0 && (
          <div className="px-8 py-4 border-t border-neutral-800 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-600">
            <p>
              Showing{" "}
              <span className="text-neutral-400 font-mono">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              -{" "}
              <span className="text-neutral-400 font-mono">
                {Math.min(currentPage * itemsPerPage, totalRecords)}
              </span>{" "}
              of{" "}
              <span className="text-neutral-400 font-mono">{totalRecords}</span>{" "}
              records
            </p>
            <div className="flex items-center gap-4">
              <span className="text-neutral-500">
                Page {currentPage} of {totalPages || 1}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="!px-4 !py-1.5 rounded-lg !text-[9px] border-neutral-800"
                  disabled={currentPage === 1 || isLoading}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  className="!px-4 !py-1.5 rounded-lg !text-[9px] border-neutral-800"
                  disabled={currentPage >= totalPages || isLoading}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

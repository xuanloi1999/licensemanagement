import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Card, Input, Button, Badge, Modal } from "../components/UI";
import { PLANS } from "../constants";
import { LicenseStatus, Organization } from "../types";
import OrganizationService, {
  CreateOrganizationPayload,
} from "../services/OrganizationService";
import SubscriptionPlanService, {
  SubscriptionPlan,
} from "../services/SubscriptionPlanService";

interface AdminDashboardProps {
  onSelectOrg: (id: string) => void;
}

interface NewOrgFormData {
  name: string;
  email: string;
  planId: string;
  validity: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSelectOrg,
}) => {
  // Data state
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<LicenseStatus | "all">(
    "all"
  );
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewOrgFormData>({
    defaultValues: {
      name: "",
      email: "",
      planId: "pro",
      validity: "12",
    },
  });

  const selectedPlanId = watch("planId");
  const selectedValidity = watch("validity");

  // Use API plans if available, fallback to constants
  const availablePlans =
    subscriptionPlans.length > 0
      ? subscriptionPlans.map((p) => ({
          id: String(p.id),
          name: p.name,
          description: `${p.quota.users} users, ${p.quota.storage_gb}GB storage`,
          defaultQuotas: {
            seats: p.quota.users,
            labs: Math.floor(p.quota.users / 2),
            concurrency: Math.ceil(p.quota.users / 5),
          },
        }))
      : PLANS;

  const selectedPlan =
    availablePlans.find((p) => p.id === selectedPlanId) || availablePlans[0];

  // Fetch data on mount
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [orgsResponse, plansResponse] = await Promise.all([
        OrganizationService.list(),
        SubscriptionPlanService.list(),
      ]);

      // Transform API response to match Organization type
      const orgs: Organization[] = orgsResponse.data.data.map((org: any) => ({
        id: org.organization_id || org.id,
        name: org.organization_name || org.name,
        status: org.status || "active",
        planId: org.subscription_plan || "pro",
        licenseKey: org.license_key || "",
        expiryDate: org.expiry_date || "2025-12-31",
        quotas: org.quotas || {
          seats: { current: 0, total: 50 },
          labs: { current: 0, total: 10 },
          concurrency: { current: 0, total: 5 },
        },
      }));

      setOrganizations(orgs);
      setSubscriptionPlans(plansResponse.data.data || []);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load data. Please try again.";
      setError(errorMessage);
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtered and paginated data
  const filteredOrgs = useMemo(() => {
    return organizations.filter((org) => {
      const matchesSearch =
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || org.status === statusFilter;
      const matchesPlan = planFilter === "all" || org.planId === planFilter;
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [organizations, searchTerm, statusFilter, planFilter]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredOrgs.length / itemsPerPage);
  const paginatedOrgs = filteredOrgs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Create organization handler
  const onSubmit = async (data: NewOrgFormData) => {
    setCreateError(null);

    try {
      const payload: CreateOrganizationPayload = {
        organization_id: `org-${Date.now()}`, // Generate unique ID
        organization_name: data.name,
        subscription_plan: data.planId,
      };

      await OrganizationService.create(payload);

      // Refresh data
      await fetchData();

      setShowCreateModal(false);
      reset();
      alert(
        `Success: Organization "${data.name}" initialized. License generated.`
      );
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to create organization.";

      if (err.response?.status === 422) {
        // Handle validation errors
        const serverErrors = err.response?.data?.errors || {};
        if (serverErrors.organization_name) {
          setCreateError(serverErrors.organization_name[0]);
        } else if (serverErrors.organization_id) {
          setCreateError(serverErrors.organization_id[0]);
        } else {
          setCreateError(errorMessage);
        }
      } else {
        setCreateError(errorMessage);
      }
    }
  };

  // Modal close handler
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setCreateError(null);
    reset();
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPlanFilter("all");
    setCurrentPage(1);
  };

  // Retry fetch
  const handleRetry = () => {
    fetchData();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-neutral-800 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-neutral-500 text-sm font-medium">
            Loading organizations...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && organizations.length === 0) {
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
          <h3 className="text-lg font-bold text-white">Failed to load data</h3>
          <p className="text-neutral-500 text-sm">{error}</p>
          <Button onClick={handleRetry} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold font-display tracking-tight text-white">
            Organization Registry
          </h1>
          <p className="text-neutral-500 text-sm mt-1 font-medium">
            Manage global enterprise identities, licenses, and resource grids.
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-3 group px-6 py-3 rounded-xl shadow-xl shadow-primary/10 transition-all hover:scale-105 active:scale-95"
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="font-bold text-xs uppercase tracking-widest">
            New Organization
          </span>
        </Button>
      </div>

      {/* Error Banner (non-blocking) */}
      {error && organizations.length > 0 && (
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
                Some data may be outdated. {error}
              </span>
            </div>
            <Button
              variant="ghost"
              onClick={handleRetry}
              className="!py-1.5 !px-3 !text-[10px]"
            >
              Refresh
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card className="p-6 flex flex-wrap gap-5 items-end bg-background-darker/40 backdrop-blur-md border-neutral-800 rounded-3xl shadow-xl">
        <div className="flex-1 min-w-[280px]">
          <Input
            label="Search Directory"
            placeholder="Name, UID, or License Key..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="!bg-neutral-950/40"
          />
        </div>
        <div className="w-48">
          <label className="block text-[10px] font-bold text-neutral-500 mb-2 uppercase tracking-widest">
            Status
          </label>
          <select
            className="w-full bg-neutral-950/40 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary transition-all font-bold appearance-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as LicenseStatus | "all");
              setCurrentPage(1);
            }}
          >
            <option value="all">All States</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="w-48">
          <label className="block text-[10px] font-bold text-neutral-500 mb-2 uppercase tracking-widest">
            SLA Tier
          </label>
          <select
            className="w-full bg-neutral-950/40 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary transition-all font-bold appearance-none cursor-pointer"
            value={planFilter}
            onChange={(e) => {
              setPlanFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Tiers</option>
            {availablePlans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <Button
          variant="ghost"
          onClick={handleResetFilters}
          className="!py-3 font-bold text-[10px] tracking-widest uppercase hover:text-white border border-transparent hover:border-neutral-800 px-6 rounded-xl transition-all"
        >
          Reset
        </Button>
      </Card>

      {/* Organization List */}
      <div className="grid gap-4">
        {paginatedOrgs.map((org) => (
          <Card
            key={org.id}
            className="hover:border-primary/40 transition-all group hover:bg-neutral-900/20 border-neutral-800/60 rounded-[1.5rem] shadow-sm cursor-pointer"
            onClick={() => onSelectOrg(org.id)}
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center font-display font-bold text-2xl text-neutral-600 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all duration-500 shadow-inner">
                  {org.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">
                      {org.name}
                    </h3>
                    <Badge
                      status={org.status}
                      className="!text-[8px] !px-2 !py-0.5"
                    />
                  </div>
                  <div className="flex items-center gap-6 text-white">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-bold text-neutral-600 tracking-widest">
                        UID
                      </span>
                      <span className="font-mono text-[11px] text-neutral-400">
                        {org.id}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-bold text-neutral-600 tracking-widest">
                        Plan
                      </span>
                      <span className="text-[11px] font-bold text-secondary uppercase">
                        {availablePlans.find((p) => p.id === org.planId)
                          ?.name || org.planId}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-bold text-neutral-600 tracking-widest">
                        Expiry
                      </span>
                      <span className="text-[11px] font-bold text-neutral-400">
                        {org.expiryDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-10 px-8 border-x border-neutral-800/30 h-10">
                <div className="flex flex-col items-center">
                  <div className="text-neutral-500 text-[9px] uppercase font-bold tracking-[0.2em] mb-1">
                    Seats
                  </div>
                  <div className="text-md font-bold text-white">
                    {org.quotas.seats.current}
                    <span className="text-neutral-600 mx-1">/</span>
                    {org.quotas.seats.total}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-neutral-500 text-[9px] uppercase font-bold tracking-[0.2em] mb-1">
                    Labs
                  </div>
                  <div className="text-md font-bold text-white">
                    {org.quotas.labs.current}
                    <span className="text-neutral-600 mx-1">/</span>
                    {org.quotas.labs.total}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectOrg(org.id);
                  }}
                  className="hidden xl:flex items-center gap-2 group-hover:bg-primary group-hover:text-white group-hover:border-primary !py-2 !px-5 !text-[10px] font-bold tracking-widest uppercase rounded-xl transition-all border-neutral-800"
                >
                  Configure License
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Button>
                <div className="xl:hidden w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-primary group-hover:border-primary/30 transition-all">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {/* Empty State */}
        {filteredOrgs.length === 0 && (
          <div className="py-24 text-center flex flex-col items-center bg-background-darker/20 rounded-3xl border border-dashed border-neutral-800 shadow-inner">
            <div className="w-16 h-16 rounded-2xl bg-neutral-900/50 flex items-center justify-center mb-6 shadow-2xl border border-neutral-800">
              <svg
                className="w-8 h-8 text-neutral-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-neutral-400 mb-1">
              No matching entities
            </h3>
            <p className="text-neutral-600 text-xs max-w-sm mx-auto">
              Adjust your search parameters or lifecycle filters.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredOrgs.length > 0 && (
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-600 pt-8 border-t border-neutral-900/50">
          <p>
            Total Records:{" "}
            <span className="text-neutral-400 font-mono">
              {filteredOrgs.length}
            </span>
          </p>
          <div className="flex items-center gap-6">
            <span className="text-neutral-500">
              Page {currentPage} of {totalPages || 1}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="!px-4 !py-1.5 rounded-lg !text-[9px] border-neutral-800"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                className="!px-4 !py-1.5 rounded-lg !text-[9px] border-neutral-800"
                disabled={currentPage >= totalPages}
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

      {/* Create Organization Modal */}
      <Modal
        isOpen={showCreateModal}
        size="4xl"
        onClose={() => {
          setShowCreateModal(false);
          reset();
        }}
        title="Provision New Entity"
        footer={
          <>
            <Button
              variant="ghost"
              className="!text-[10px] font-bold uppercase tracking-widest px-6"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="!text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-primary/30 px-10 !py-4 rounded-xl flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Initialize Grid Node
            </Button>
          </>
        }
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-10 max-w-4xl mx-auto"
        >
          {/* Server Error */}
          {createError && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-red-500 flex-shrink-0"
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
                <span className="text-sm text-red-400">{createError}</span>
              </div>
            </div>
          )}

          {/* Section 1: Entity Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              <h4 className="text-[12px] font-bold text-white uppercase tracking-[0.2em]">
                01. Entity Identity
              </h4>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Input
                  label="Legal Organization Name"
                  placeholder="e.g. Weyland-Yutani Corp"
                  {...register("name", {
                    required: "Organization name is required",
                    minLength: {
                      value: 3,
                      message: "Minimum 3 characters required",
                    },
                  })}
                  className="!bg-neutral-950/40"
                />
                {errors.name && (
                  <p className="mt-2 text-xs text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  label="Primary Authority Email"
                  placeholder="admin@entity.com"
                  type="email"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="!bg-neutral-950/40"
                />
                {errors.email && (
                  <p className="mt-2 text-xs text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Service Level Agreement */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
              <div className="w-1.5 h-6 bg-secondary rounded-full"></div>
              <h4 className="text-[12px] font-bold text-white uppercase tracking-[0.2em]">
                02. SLA Configuration
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {availablePlans.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setValue("planId", p.id)}
                  className={`p-6 rounded-2xl border transition-all text-left flex flex-col group relative overflow-hidden ${
                    selectedPlanId === p.id
                      ? "bg-gradient-to-br from-neutral-900 to-neutral-950 border-primary shadow-lg shadow-primary/5"
                      : "bg-neutral-950/20 border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  <div
                    className={`absolute top-0 right-0 w-16 h-16 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity ${
                      p.id === "enterprise"
                        ? "bg-primary"
                        : p.id === "pro"
                        ? "bg-secondary"
                        : "bg-neutral-500"
                    }`}
                  ></div>
                  <div className="flex justify-between items-start mb-4 relative">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest ${
                        selectedPlanId === p.id
                          ? "text-primary"
                          : "text-neutral-500"
                      }`}
                    >
                      {p.id}
                    </span>
                    {selectedPlanId === p.id && (
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center animate-pulse">
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h5 className="text-lg font-bold text-white mb-2 font-display">
                    {p.name}
                  </h5>
                  <p className="text-[10px] text-neutral-500 leading-relaxed truncate">
                    {p.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Live Preview of Quotas */}
            <div className="p-6 bg-neutral-950/60 rounded-3xl border border-neutral-800 shadow-inner grid grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest mb-2">
                  Reserved Seats
                </p>
                <p className="text-3xl font-bold font-display text-white">
                  {selectedPlan.defaultQuotas.seats}
                </p>
              </div>
              <div className="text-center border-x border-neutral-800/50">
                <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest mb-2">
                  Compute Labs
                </p>
                <p className="text-3xl font-bold font-display text-white">
                  {selectedPlan.defaultQuotas.labs}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest mb-2">
                  Burst Cap
                </p>
                <p className="text-3xl font-bold font-display text-white">
                  {selectedPlan.defaultQuotas.concurrency}x
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Activation Term */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
              <div className="w-1.5 h-6 bg-neutral-500 rounded-full"></div>
              <h4 className="text-[12px] font-bold text-white uppercase tracking-[0.2em]">
                03. Deployment Horizon
              </h4>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Input
                  label="Initial Validity (Months)"
                  type="number"
                  {...register("validity", {
                    required: "Validity is required",
                    min: { value: 1, message: "Minimum 1 month" },
                    max: { value: 60, message: "Maximum 60 months" },
                  })}
                  className="!bg-neutral-950/40"
                />
                {errors.validity && (
                  <p className="mt-2 text-xs text-red-400">
                    {errors.validity.message}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3 pt-6">
                {["6", "12", "24", "36"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setValue("validity", v)}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-bold border transition-all ${
                      selectedValidity === v
                        ? "border-primary text-primary bg-primary/5 shadow-lg shadow-primary/5"
                        : "border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-white"
                    }`}
                  >
                    {v} MONTHS
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 bg-primary/5 border border-primary/20 rounded-[1.5rem] flex items-start gap-4 animate-fade-in group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">
                  Grid Provisioning Logic
                </p>
                <p className="text-[11px] text-neutral-400 leading-relaxed italic">
                  System will generate a master{" "}
                  <span className="text-white font-bold">AES-256</span> license
                  link. Node allocation begins immediately upon authorization.
                  This event will be recorded in the immutable system ledger.
                </p>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

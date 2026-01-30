import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, Badge, Button, Modal, Input } from "../components/UI";
import { PLANS } from "../constants";
import SubscriptionPlanService, {
  SubscriptionPlan,
  CreateSubscriptionPlanPayload,
  UpdateSubscriptionPlanPayload,
} from "../services/SubscriptionPlanService";

interface PlanFormData {
  name: string;
  users: number;
  storage_gb: number;
}

export const AdminPlans: React.FC = () => {
  // Data state
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const [modalError, setModalError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PlanFormData>({
    defaultValues: {
      name: "",
      users: 10,
      storage_gb: 100,
    },
  });

  // Fetch plans from API
  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await SubscriptionPlanService.list();
      setPlans(response.data.data || []);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load subscription plans.";
      setError(errorMessage);
      console.error("Failed to fetch plans:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Create plan handler
  const onCreateSubmit = async (data: PlanFormData) => {
    setModalError(null);

    try {
      const payload: CreateSubscriptionPlanPayload = {
        name: data.name,
        quota: {
          users: data.users,
          storage_gb: data.storage_gb,
        },
      };

      await SubscriptionPlanService.create(payload);
      await fetchPlans();

      setShowCreateModal(false);
      reset();
      alert(`Success: Plan "${data.name}" created successfully.`);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to create plan.";
      setModalError(errorMessage);
    }
  };

  // Update plan handler
  const onEditSubmit = async (data: PlanFormData) => {
    if (!selectedPlan) return;
    setModalError(null);

    try {
      const payload: UpdateSubscriptionPlanPayload = {
        name: data.name,
        quota: {
          users: data.users,
          storage_gb: data.storage_gb,
        },
      };

      await SubscriptionPlanService.update(selectedPlan.id, payload);
      await fetchPlans();

      setShowEditModal(false);
      setSelectedPlan(null);
      reset();
      alert(`Success: Plan "${data.name}" updated successfully.`);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to update plan.";
      setModalError(errorMessage);
    }
  };

  // Delete plan handler
  const handleDelete = async () => {
    if (!selectedPlan) return;
    setIsDeleting(true);
    setModalError(null);

    try {
      await SubscriptionPlanService.delete(selectedPlan.id);
      await fetchPlans();

      setShowDeleteConfirm(false);
      setSelectedPlan(null);
      alert(`Plan "${selectedPlan.name}" deleted successfully.`);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to delete plan.";
      setModalError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  // Open edit modal
  const openEditModal = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setValue("name", plan.name);
    setValue("users", plan.quota.users);
    setValue("storage_gb", plan.quota.storage_gb);
    setModalError(null);
    setShowEditModal(true);
  };

  // Open delete confirmation
  const openDeleteConfirm = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setModalError(null);
    setShowDeleteConfirm(true);
  };

  // Close modals
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setModalError(null);
    reset();
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedPlan(null);
    setModalError(null);
    reset();
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteConfirm(false);
    setSelectedPlan(null);
    setModalError(null);
  };

  // Merge API plans with default features for display
  const displayPlans =
    plans.length > 0
      ? plans.map((plan) => {
          const fallbackPlan = PLANS.find(
            (p) => p.name.toLowerCase() === plan.name.toLowerCase()
          );
          return {
            ...plan,
            description:
              fallbackPlan?.description ||
              `${plan.quota.users} users, ${plan.quota.storage_gb}GB storage`,
            features: fallbackPlan?.features || [
              "Standard Support",
              "API Access",
              "Dashboard Analytics",
            ],
            featureFlags: fallbackPlan?.featureFlags || [
              { key: "api_access", label: "API Access", enabled: true },
              {
                key: "custom_branding",
                label: "Custom Branding",
                enabled: plan.quota.users >= 50,
              },
              {
                key: "priority_support",
                label: "Priority Support",
                enabled: plan.quota.users >= 100,
              },
            ],
            defaultQuotas: {
              seats: plan.quota.users,
              labs: Math.floor(plan.quota.users / 2),
              concurrency: Math.ceil(plan.quota.users / 5),
            },
          };
        })
      : PLANS;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-neutral-800 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-neutral-500 text-sm font-medium">
            Loading subscription plans...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && plans.length === 0) {
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
            Failed to load subscription plans
          </h3>
          <p className="text-neutral-500 text-sm">{error}</p>
          <Button onClick={fetchPlans} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold font-display tracking-tight text-white">
            Grid Blueprints
          </h1>
          <p className="text-neutral-500 text-sm mt-1 font-medium">
            Standardized resource tiers and operational capability constraints.
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
            New Plan
          </span>
        </Button>
      </div>

      {/* Error Banner */}
      {error && plans.length > 0 && (
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
              <span className="text-sm text-yellow-400">{error}</span>
            </div>
            <Button
              variant="ghost"
              onClick={fetchPlans}
              className="!py-1.5 !px-3 !text-[10px]"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {displayPlans.map((plan) => {
          const planId = String(plan.id);
          const isEnterprise = plan.name.toLowerCase().includes("enterprise");
          const isPro = plan.name.toLowerCase().includes("pro");

          return (
            <Card
              key={planId}
              className="flex flex-col border-neutral-800 bg-background-darker/40 rounded-[2.5rem] shadow-2xl relative overflow-hidden group hover:border-neutral-700 transition-all"
            >
              {/* Tier Accent Header */}
              <div
                className={`absolute top-0 left-0 w-full h-2 ${
                  isEnterprise
                    ? "bg-primary"
                    : isPro
                    ? "bg-secondary"
                    : "bg-neutral-600"
                }`}
              ></div>

              <div className="p-10 border-b border-neutral-800/50 bg-neutral-900/10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3
                      className={`text-4xl font-bold font-display tracking-tighter mb-1 ${
                        isEnterprise
                          ? "text-primary"
                          : isPro
                          ? "text-secondary"
                          : "text-white"
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest font-bold">
                        PROFILE_UUID: {planId}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(plan as SubscriptionPlan)}
                      className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-inner text-neutral-500 hover:text-primary hover:border-primary/30 transition-colors"
                      title="Edit Plan"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        openDeleteConfirm(plan as SubscriptionPlan)
                      }
                      className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-inner text-neutral-500 hover:text-red-500 hover:border-red-500/30 transition-colors"
                      title="Delete Plan"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-medium mb-8 max-w-[280px]">
                  {plan.description}
                </p>

                {/* Quotas Summary */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800 shadow-inner">
                    <p className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest mb-1.5">
                      Seats
                    </p>
                    <p className="text-xl font-bold text-white tracking-tighter">
                      {plan.defaultQuotas?.seats || plan.quota?.users || 0}
                    </p>
                  </div>
                  <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800 shadow-inner">
                    <p className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest mb-1.5">
                      Storage
                    </p>
                    <p className="text-xl font-bold text-white tracking-tighter">
                      {plan.quota?.storage_gb || 0}GB
                    </p>
                  </div>
                  <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800 shadow-inner">
                    <p className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest mb-1.5">
                      Burst
                    </p>
                    <p className="text-xl font-bold text-white tracking-tighter">
                      {plan.defaultQuotas?.concurrency || 1}x
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-10 flex-1 space-y-10 pb-12">
                {/* Feature List */}
                <div className="space-y-6">
                  <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-[0.3em] flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    Service Inclusions
                  </p>
                  <div className="grid gap-4">
                    {plan.features?.map((feature: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 group/item"
                      >
                        <div className="w-6 h-6 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center text-success shrink-0">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-xs font-bold text-neutral-300 uppercase tracking-tight group-hover/item:text-white transition-colors">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature Flags */}
                <div className="space-y-6">
                  <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-[0.3em] flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                    Capability Grid
                  </p>
                  <div className="bg-neutral-950/40 rounded-[2rem] p-6 border border-neutral-800/60 space-y-5">
                    {plan.featureFlags?.map((flag: any, idx: number) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between group/flag ${
                          !flag.enabled ? "opacity-40" : ""
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-white tracking-tight uppercase">
                            {flag.label}
                          </span>
                          <span className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest mt-0.5">
                            {flag.key}
                          </span>
                        </div>
                        <div
                          className={`p-1.5 rounded-lg border transition-all ${
                            flag.enabled
                              ? "bg-success/10 border-success/20 text-success"
                              : "bg-neutral-900 border-neutral-800 text-neutral-700"
                          }`}
                        >
                          {flag.enabled ? (
                            <svg
                              className="w-4 h-4"
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
                          ) : (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Info Banner */}
      <div className="p-10 bg-primary/5 rounded-[3rem] border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-primary/20 shrink-0">
            <svg
              className="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-2xl font-bold font-display text-white mb-2">
              Immutable Protocol Active
            </h4>
            <p className="text-sm text-neutral-400 max-w-lg leading-relaxed font-medium">
              Any changes to these blueprints will be logged in the global
              ledger. Active organizations on these tiers will be notified of
              grid reconfiguration windows.
            </p>
          </div>
        </div>
      </div>

      {/* Create Plan Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        title="Create New Plan"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={handleCloseCreateModal}
              disabled={isSubmitting}
              className="!text-[10px] font-bold uppercase tracking-widest px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onCreateSubmit)}
              disabled={isSubmitting}
              className="!text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-primary/30 px-10 !py-4 rounded-xl flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Create Plan
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-6">
          {modalError && (
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
                <span className="text-sm text-red-400">{modalError}</span>
              </div>
            </div>
          )}

          <div>
            <Input
              label="Plan Name"
              placeholder="e.g. Enterprise Plus"
              {...register("name", {
                required: "Plan name is required",
                minLength: { value: 2, message: "Minimum 2 characters" },
              })}
              className="!bg-neutral-950/40"
            />
            {errors.name && (
              <p className="mt-2 text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Input
                label="User Seats"
                type="number"
                {...register("users", {
                  required: "Users is required",
                  min: { value: 1, message: "Minimum 1 user" },
                  valueAsNumber: true,
                })}
                className="!bg-neutral-950/40"
              />
              {errors.users && (
                <p className="mt-2 text-xs text-red-400">
                  {errors.users.message}
                </p>
              )}
            </div>
            <div>
              <Input
                label="Storage (GB)"
                type="number"
                {...register("storage_gb", {
                  required: "Storage is required",
                  min: { value: 1, message: "Minimum 1 GB" },
                  valueAsNumber: true,
                })}
                className="!bg-neutral-950/40"
              />
              {errors.storage_gb && (
                <p className="mt-2 text-xs text-red-400">
                  {errors.storage_gb.message}
                </p>
              )}
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Plan Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        title={`Edit Plan: ${selectedPlan?.name || ""}`}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={handleCloseEditModal}
              disabled={isSubmitting}
              className="!text-[10px] font-bold uppercase tracking-widest px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onEditSubmit)}
              disabled={isSubmitting}
              className="!text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-primary/30 px-10 !py-4 rounded-xl flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Save Changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-6">
          {modalError && (
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
                <span className="text-sm text-red-400">{modalError}</span>
              </div>
            </div>
          )}

          <div>
            <Input
              label="Plan Name"
              placeholder="e.g. Enterprise Plus"
              {...register("name", {
                required: "Plan name is required",
                minLength: { value: 2, message: "Minimum 2 characters" },
              })}
              className="!bg-neutral-950/40"
            />
            {errors.name && (
              <p className="mt-2 text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Input
                label="User Seats"
                type="number"
                {...register("users", {
                  required: "Users is required",
                  min: { value: 1, message: "Minimum 1 user" },
                  valueAsNumber: true,
                })}
                className="!bg-neutral-950/40"
              />
              {errors.users && (
                <p className="mt-2 text-xs text-red-400">
                  {errors.users.message}
                </p>
              )}
            </div>
            <div>
              <Input
                label="Storage (GB)"
                type="number"
                {...register("storage_gb", {
                  required: "Storage is required",
                  min: { value: 1, message: "Minimum 1 GB" },
                  valueAsNumber: true,
                })}
                className="!bg-neutral-950/40"
              />
              {errors.storage_gb && (
                <p className="mt-2 text-xs text-red-400">
                  {errors.storage_gb.message}
                </p>
              )}
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={handleCloseDeleteModal}
        title="Delete Plan"
      >
        <div className="text-center py-6">
          {modalError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-left">
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
                <span className="text-sm text-red-400">{modalError}</span>
              </div>
            </div>
          )}

          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-white mb-3">
            Delete "{selectedPlan?.name}"?
          </h4>
          <p className="text-neutral-500 text-sm max-w-sm mx-auto">
            This action cannot be undone. Organizations using this plan will
            need to be migrated to another tier.
          </p>
          <div className="mt-8 flex gap-4">
            <Button
              variant="ghost"
              onClick={handleCloseDeleteModal}
              disabled={isDeleting}
              className="flex-1 rounded-xl uppercase font-bold text-[10px] py-4 border border-neutral-800"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 rounded-xl uppercase font-bold text-[10px] py-4 shadow-xl flex items-center justify-center gap-2"
            >
              {isDeleting && (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              )}
              {isDeleting ? "Deleting..." : "Delete Plan"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

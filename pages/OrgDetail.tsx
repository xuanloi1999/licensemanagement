import React, { useState, useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, Button, Badge, Progress, Modal, Input } from "../components/UI";
import { Organization, Plan } from "../types";
import OrganizationService from "../services/OrganizationService";
import SubscriptionPlanService, {
  SubscriptionPlan,
} from "../services/SubscriptionPlanService";

interface OrgDetailProps {
  org: Organization;
  onBack: () => void;
  onUpdate?: (updatedOrg: Organization) => void;
}

interface RenewalFormData {
  expiryDate: string;
  planId: string;
}

export const OrgDetail: React.FC<OrgDetailProps> = ({
  org,
  onBack,
  onUpdate,
}) => {
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [isRegeneratingKey, setIsRegeneratingKey] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // React Hook Form for renewal modal
  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<RenewalFormData>({
    defaultValues: {
      expiryDate: org.expiryDate || "2026-12-31",
      planId: org.planId,
    },
  });

  const selectedPlanId = watch("planId");
  const renewDate = watch("expiryDate");

  const currentPlan = plans.find((p) => p.name === org.planId) ?? null;
  const newPlan = plans.find((p) => p.name === selectedPlanId) ?? currentPlan;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(org.licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleRegenerateLicenseKey = async () => {
    setIsRegeneratingKey(true);
    setServerError(null);

    try {
      const response = await OrganizationService.regenerateLicenseKey(org.id);
      const updatedOrg = response.data.data;

      if (onUpdate) {
        onUpdate({ ...org, licenseKey: updatedOrg.license_key });
      }

      alert("License key regenerated successfully.");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to regenerate license key.";
      setServerError(errorMessage);
    } finally {
      setIsRegeneratingKey(false);
    }
  };

  const onRenewalSubmit = async (data: RenewalFormData) => {
    setServerError(null);

    try {
      // Update subscription plan if changed
      if (data.planId !== org.planId) {
        await SubscriptionPlanService.update(data.planId, {
          name: newPlan.name,
        });
      }

      // Here you would call your API to update the organization
      // For now, we'll simulate the update
      // await OrganizationService.update(org.id, {
      //   subscription_plan: data.planId,
      //   expiry_date: data.expiryDate,
      // });

      if (onUpdate) {
        onUpdate({
          ...org,
          planId: data.planId,
          expiryDate: data.expiryDate,
        });
      }

      setShowRenewModal(false);
      reset();
      alert(
        `SUCCESS: Renewal applied to ${org.name}. Plan: ${newPlan.name}, Expiry: ${data.expiryDate}`
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update subscription.";
      setServerError(errorMessage);
    }
  };

  const handleRevoke = async () => {
    setIsRevoking(true);
    setServerError(null);

    try {
      // Call API to revoke access
      // await OrganizationService.revoke(org.id);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onUpdate) {
        onUpdate({ ...org, status: "revoked" });
      }

      setShowRevokeConfirm(false);
      alert(`ACCESS REVOKED: ${org.name} has been terminated.`);
      onBack();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to revoke access.";
      setServerError(errorMessage);
    } finally {
      setIsRevoking(false);
    }
  };

  const handleCloseRenewModal = () => {
    setShowRenewModal(false);
    setServerError(null);
    reset({
      expiryDate: org.expiryDate || "2026-12-31",
      planId: org.planId,
    });
  };

  const handleCloseRevokeModal = () => {
    setShowRevokeConfirm(false);
    setServerError(null);
  };

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

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 md:gap-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="!p-2.5 md:!p-3 hover:bg-neutral-800 rounded-2xl group transition-all border border-transparent hover:border-neutral-800 shadow-sm"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-1">
              <h1 className="text-2xl md:text-4xl font-bold font-display tracking-tight text-white truncate">
                {org.name}
              </h1>
              <Badge
                status={org.status}
                className="!text-[8px] md:!text-[10px] !px-3 md:!px-4 !py-0.5 md:!py-1 !rounded-xl shrink-0"
              />
            </div>
            <p className="text-neutral-500 text-[8px] md:text-[10px] uppercase font-bold tracking-[0.2em] font-mono opacity-60 truncate">
              NODE: {org.id}
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => setShowRenewModal(true)}
            className="flex-1 md:flex-none !px-4 md:!px-6 !py-2.5 md:!py-3 rounded-xl !text-[9px] md:!text-[10px] font-bold uppercase tracking-widest border-neutral-800 shadow-md"
          >
            Renew License
          </Button>
          <Button
            variant="danger"
            onClick={() => setShowRevokeConfirm(true)}
            className="flex-1 md:flex-none !px-4 md:!px-6 !py-2.5 md:!py-3 rounded-xl !text-[9px] md:!text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-error/20"
          >
            Revoke Access
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        {/* License Detail Card */}
        <Card className="p-6 md:p-10 border-neutral-800 bg-background-darker/60 rounded-[1.5rem] md:rounded-[2.5rem] relative overflow-hidden shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-10 pb-6 border-b border-neutral-800/50 gap-4">
            <h3 className="text-xs md:text-sm font-bold flex items-center gap-3 md:gap-4 uppercase tracking-[0.2em] text-neutral-400">
              <span className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </span>
              License Information
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-[9px] md:text-[10px] text-neutral-600 font-bold uppercase tracking-widest">
                Global Status:
              </span>
              <Badge status={org.status} className="!px-4 !py-1 !rounded-lg" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-3">
              <p className="text-neutral-500 text-[8px] md:text-[9px] uppercase font-bold tracking-[0.2em] mb-1">
                AES-256 License Key
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 relative group">
                  <code className="block w-full bg-neutral-950 px-4 py-3 md:py-4 rounded-xl md:rounded-2xl border border-neutral-800 font-mono text-[11px] md:text-[13px] text-neutral-300 shadow-inner truncate tracking-[0.2em]">
                    {showKey ? org.licenseKey : "••••-••••-••••-••••"}
                  </code>
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors p-1"
                    type="button"
                  >
                    {showKey ? (
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
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
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
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleCopy}
                  className="!p-3.5 md:!p-4 hover:bg-neutral-800 rounded-xl md:rounded-2xl transition-all border border-neutral-800"
                  type="button"
                >
                  {copied ? (
                    <svg
                      className="w-4 h-4 text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 text-neutral-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleRegenerateLicenseKey}
                  disabled={isRegeneratingKey}
                  className="!p-3.5 md:!p-4 hover:bg-neutral-800 rounded-xl md:rounded-2xl transition-all border border-neutral-800 disabled:opacity-50"
                  type="button"
                  title="Regenerate License Key"
                >
                  {isRegeneratingKey ? (
                    <div className="w-4 h-4 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg
                      className="w-4 h-4 text-neutral-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-neutral-500 text-[8px] md:text-[9px] uppercase font-bold tracking-[0.2em] mb-1">
                Expiration Period
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-primary shadow-inner shrink-0">
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <span className="text-xl md:text-2xl font-bold font-mono text-white block truncate leading-tight">
                    {org.expiryDate}
                  </span>
                  <span className="text-[8px] md:text-[9px] text-neutral-600 font-bold uppercase tracking-widest">
                    Active Termination Date
                  </span>
                </div>
              </div>
            </div>
          </div>

          < className="mt-8 md:mt-12 flex flex-col md:flex-row md:items-center justify-between p-5 md:p-7 bg-neutral-900/30 rounded-2xl md:rounded-3xl border border-neutral-800 shadow-inner gap-6">
            <div className="flex flex-wrap gap-8 md:gap-12">
              <div className="min-w-[80px]">
                <p className="text-[8px] text-neutral-600 font-bold uppercase tracking-widest mb-1">
                  SLA Profile
                </p>
                <p className="text-lg font-bold text-secondary uppercase tracking-tight truncate">
                  {currentPlan.name}
                </p>
              </div>
              <div className="min-w-[80px]">
                <p className="text-[8px] text-neutral-600 font-bold uppercase tracking-widest mb-1">
                  Provisioned
                </p>
                <p className="text-lg font-bold text-neutral-300 font-mono tracking-tighter truncate">
                  2023.01.12
                </p>
              </div>
            </div>
            {/* <Button
              variant="ghost"
              onClick={() => setShowRenewModal(true)}
              className="!text-[9px] md:!text-[10px] font-bold text-secondary hover:text-white uppercase tracking-widest flex items-center justify-center gap-2 border border-secondary/10 hover:border-secondary/40 py-3 px-6 rounded-xl transition-all"
              type="button"
            >
              Reconfigure Plan
              <svg
                className="w-4 h-4"
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
            </Button> */}
            My idol is CR7 @6361
        </Card>

        {/* Utilization Card */}
        <Card className="p-6 md:p-10 border-neutral-800 bg-background-darker/40 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-10 gap-4">
            <h3 className="text-xs md:text-sm font-bold flex items-center gap-3 md:gap-4 uppercase tracking-[0.2em] text-neutral-500">
              <span className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shadow-inner">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </span>
              Current Resource Utilization
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <Progress
              label="Assigned Seats"
              value={org.quotas.seats.current}
              total={org.quotas.seats.total}
            />
            <Progress
              label="Active Labs"
              value={org.quotas.labs.current}
              total={org.quotas.labs.total}
              color="bg-secondary"
            />
            <Progress
              label="Concurrency Load"
              value={org.quotas.concurrency.current}
              total={org.quotas.concurrency.total}
              color="bg-process"
            />
          </div>
        </Card>

        {/* Audit Ledger Card */}
        <Card className="border-neutral-800 bg-background-darker/20 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl overflow-hidden">
          <div className="p-6 md:p-10 border-b border-neutral-800 bg-neutral-900/20">
            <h3 className="text-xs md:text-sm font-bold flex items-center gap-3 md:gap-4 uppercase tracking-[0.2em] text-neutral-400">
              <span className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-400 border border-neutral-700">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              Administrative Ledger
            </h3>
          </div>
        </Card>
      </div>

      {/* RENEW / EXTEND MODAL */}
      <Modal
        isOpen={showRenewModal}
        onClose={handleCloseRenewModal}
        title="Subscription Cycle Management"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={handleCloseRenewModal}
              className="uppercase font-bold text-[10px] tracking-widest px-6"
              type="button"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onRenewalSubmit)}
              className="uppercase font-bold text-[10px] tracking-widest px-10 !py-4 rounded-xl shadow-xl shadow-primary/20 disabled:opacity-50"
              disabled={isSubmitting}
              type="button"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                "Commit Changes"
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-10 max-w-4xl mx-auto pb-6">
          {/* Server Error */}
          {serverError && (
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
                <span className="text-sm text-red-400">{serverError}</span>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-10">
            {/* Input Column */}
            <div className="space-y-8">
              <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-neutral-800 pb-2">
                  <div className="w-1 h-4 bg-primary rounded-full"></div>
                  <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                    Lifecycle Term
                  </h4>
                </div>
                <Controller
                  name="expiryDate"
                  control={control}
                  rules={{
                    required: "Expiry date is required",
                    validate: (value) => {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      return (
                        selectedDate > today ||
                        "Expiry date must be in the future"
                      );
                    },
                  }}
                  render={({ field }) => (
                    <div>
                      <Input
                        label="New Expiry Date"
                        type="date"
                        {...field}
                        className="!bg-neutral-950/40"
                      />
                      {errors.expiryDate && (
                        <p className="mt-2 text-xs text-red-400">
                          {errors.expiryDate.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-neutral-800 pb-2">
                  <div className="w-1 h-4 bg-secondary rounded-full"></div>
                  <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                    SLA Profile
                  </h4>
                </div>
                <Controller
                  name="planId"
                  control={control}
                  rules={{ required: "Please select a plan" }}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 gap-3">
                      {plans.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => field.onChange(p.name)}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                            field.value === p.id
                              ? "bg-primary/5 border-primary text-white shadow-lg shadow-primary/5"
                              : "bg-neutral-950/20 border-neutral-800 text-neutral-500 hover:border-neutral-700"
                          }`}
                        >
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-bold uppercase tracking-tight">
                              {p.name.toUpperCase()}
                            </span>
                          </div>
                          {field.value === p.name && (
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                          )}
                        </button>
                      ))}
                      {errors.planId && (
                        <p className="text-xs text-red-400">
                          {errors.planId.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </section>
            </div>

            {/* Preview Column */}
            <div className="space-y-6">
              <div className="sticky top-0 p-8 bg-neutral-950 rounded-[2rem] border border-neutral-800 shadow-inner h-full">
                <h4 className="text-[12px] font-bold text-white uppercase tracking-[0.2em] mb-8 border-b border-neutral-900 pb-4">
                  Configuration Preview
                </h4>

                <div className="space-y-8">
                  {/* Plan Switch Preview */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest">
                        Profile Shift
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-neutral-400">
                          {currentPlan.name.toUpperCase()}
                        </span>
                        <svg
                          className="w-4 h-4 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                        <span className="text-xs font-bold text-white">
                          {newPlan.name.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Date Preview */}
                  <div className="space-y-1">
                    <p className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest">
                      Horizon Extension
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-neutral-400">
                        {org.expiryDate}
                      </span>
                      <svg
                        className="w-4 h-4 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                      <span className="text-xs font-mono text-white">
                        {renewDate}
                      </span>
                    </div>
                  </div>

                  {/* Feature Delta Summary */}
                  <div className="space-y-4 pt-4 border-t border-neutral-900">
                    <p className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest">
                      Implicit Quota Update
                    </p>
                    <div className="grid gap-3">
                      {Object.entries(newPlan.quota).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center bg-neutral-900/40 p-3 rounded-xl border border-neutral-800/50"
                        >
                          <span className="text-[10px] font-bold text-neutral-500 uppercase">
                            {key}
                          </span>
                          <span className="text-[10px] font-bold text-white">
                            {value > 0 ? value : "Unlimited"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* REVOKE CONFIRMATION */}
      <Modal
        isOpen={showRevokeConfirm}
        onClose={handleCloseRevokeModal}
        title="Security Revocation"
      >
        <div className="text-center py-6 md:py-8">
          {/* Server Error */}
          {serverError && (
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
                <span className="text-sm text-red-400">{serverError}</span>
              </div>
            </div>
          )}

          <div className="w-16 h-16 md:w-20 md:h-20 bg-error/10 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 text-error animate-pulse">
            <svg
              className="w-8 h-8 md:w-10 md:h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h4 className="text-xl md:text-2xl font-bold text-white mb-3 uppercase italic tracking-tighter">
            Terminate Access?
          </h4>
          <p className="text-neutral-500 text-xs md:text-[13px] leading-relaxed max-w-sm mx-auto">
            This action immediately invalidates key-pairs for{" "}
            <span className="text-white font-bold">{org.name}</span>. This
            protocol is irreversible.
          </p>
          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 md:gap-4">
            <Button
              variant="ghost"
              onClick={handleCloseRevokeModal}
              className="flex-1 rounded-xl uppercase font-bold text-[10px] md:text-[11px] py-4 border border-neutral-800"
              type="button"
              disabled={isRevoking}
            >
              Abort
            </Button>
            <Button
              variant="danger"
              onClick={handleRevoke}
              className="flex-1 rounded-xl uppercase font-bold text-[10px] md:text-[11px] py-4 shadow-xl disabled:opacity-50"
              type="button"
              disabled={isRevoking}
            >
              {isRevoking ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Revoking...
                </div>
              ) : (
                "Confirm"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

"use client";

import { useState } from "react";

import {
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
} from "react-icons/hi";

import { FiArrowDownLeft } from "react-icons/fi";

import toast from "react-hot-toast";

import { processWithdrawal } from "@/actions/AdminWithdrawals";

import { Button } from "@/components/ui/button";

interface Withdrawal {
  id: string;
  amount: number;

  // New withdrawal structure
  method?: string | null;
  provider?: string | null;
  destination?: string | null;
  network?: string | null;

  // Kept for older withdrawals
  phoneNumber?: string | null;

  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;

  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

interface WithdrawalManagementProps {
  withdrawals: Withdrawal[];
}

const methodLabels: Record<string, string> = {
  MOBILE_MONEY: "Mobile Money",
  CRYPTO: "Cryptocurrency",
  CARD: "Bank Card",
  LOCAL_WALLET: "Local Wallet",
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};

const getMethodLabel = (
  method?: string | null,
) => {
  if (!method) {
    return "Withdrawal";
  }

  return methodLabels[method] ?? method;
};

const WithdrawalManagement = ({
  withdrawals,
}: WithdrawalManagementProps) => {
  const [loadingId, setLoadingId] = useState<
    string | null
  >(null);

  const pendingCount = withdrawals.filter(
    (withdrawal) =>
      withdrawal.status === "PENDING",
  ).length;

  const handleAction = async (
    withdrawalId: string,
    action: "APPROVE" | "REJECT",
  ) => {
    const confirmed = window.confirm(
      action === "APPROVE"
        ? "Are you sure you want to approve this withdrawal?"
        : "Are you sure you want to reject this withdrawal and return the amount to the user's balance?",
    );

    if (!confirmed) {
      return;
    }

    setLoadingId(withdrawalId);

    try {
      const result = await processWithdrawal({
        withdrawalId,
        action,
      });

      if (result.success) {
        toast.success(result.message);
        window.location.reload();
        return;
      }

      toast.error(result.message);
    } catch {
      toast.error(
        "Something went wrong. Please try again.",
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-medium text-primary">
          Administration
        </p>

        <h1 className="mt-1.5 text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl">
          Withdrawal Management
        </h1>

        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
          Review and manage user withdrawal requests.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-5 grid grid-cols-3 gap-2.5">
        <div className="rounded-xl border-custom2 bg-card p-3.5 sm:p-4">
          <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">
            Total
          </p>

          <p className="mt-1 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {withdrawals.length}
          </p>
        </div>

        <div className="rounded-xl border-custom2 bg-card p-3.5 sm:p-4">
          <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">
            Pending
          </p>

          <p className="mt-1 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-xl border-custom2 bg-card p-3.5 sm:p-4">
          <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">
            Processed
          </p>

          <p className="mt-1 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {withdrawals.length - pendingCount}
          </p>
        </div>
      </div>

      {/* Empty State */}
      {withdrawals.length === 0 ? (
        <div className="rounded-xl border-custom2 bg-card px-5 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FiArrowDownLeft
              size={22}
              className="text-muted-foreground"
              aria-hidden="true"
            />
          </div>

          <h2 className="mt-3 text-sm font-semibold text-foreground">
            No withdrawal requests
          </h2>

          <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
            Withdrawal requests will appear here when users
            submit them.
          </p>
        </div>
      ) : (
        /* Withdrawal List */
        <div className="space-y-4">
          {withdrawals.map((withdrawal) => {
            const isLoading =
              loadingId === withdrawal.id;

            const isPending =
              withdrawal.status === "PENDING";

            const methodLabel = getMethodLabel(
              withdrawal.method,
            );

            const destination =
              withdrawal.destination ||
              withdrawal.phoneNumber ||
              "—";

            return (
              <div
                key={withdrawal.id}
                className="rounded-xl border-custom2 bg-card p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4">
                  {/* User + Status */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <FiArrowDownLeft
                          size={18}
                          className="text-primary"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="min-w-0">
                        <h2 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
                          $
                          {withdrawal.amount.toLocaleString()}
                        </h2>

                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {withdrawal.user.name ||
                            "Unnamed User"}
                        </p>

                        <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
                          {withdrawal.user.email ||
                            "No email address"}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    {withdrawal.status ===
                      "PENDING" && (
                      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-1 text-[11px] font-medium text-yellow-700">
                        <HiOutlineClock
                          size={13}
                          aria-hidden="true"
                        />
                        Pending
                      </span>
                    )}

                    {withdrawal.status ===
                      "APPROVED" && (
                      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                        <HiOutlineCheckCircle
                          size={13}
                          aria-hidden="true"
                        />
                        Approved
                      </span>
                    )}

                    {withdrawal.status ===
                      "REJECTED" && (
                      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-destructive/20 bg-destructive/10 px-2.5 py-1 text-[11px] font-medium text-destructive">
                        <HiOutlineXCircle
                          size={13}
                          aria-hidden="true"
                        />
                        Rejected
                      </span>
                    )}
                  </div>

                  {/* Withdrawal Details */}
                  <div className="grid gap-3 border-y border-border py-3.5 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-[11px] font-medium text-muted-foreground">
                        Method
                      </p>

                      <p className="mt-0.5 text-xs font-medium text-foreground sm:text-sm">
                        {methodLabel}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium text-muted-foreground">
                        Provider
                      </p>

                      <p className="mt-0.5 text-xs font-medium text-foreground sm:text-sm">
                        {withdrawal.provider ||
                          withdrawal.network ||
                          "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium text-muted-foreground">
                        Destination
                      </p>

                      <p className="mt-0.5 break-all text-xs font-medium text-foreground sm:text-sm">
                        {destination}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium text-muted-foreground">
                        Submitted
                      </p>

                      <p className="mt-0.5 text-xs font-medium text-foreground sm:text-sm">
                        {formatDate(
                          withdrawal.createdAt,
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Crypto Network */}
                  {withdrawal.network && (
                    <div className="rounded-lg bg-muted/50 px-3.5 py-2.5">
                      <p className="text-[11px] font-medium text-muted-foreground">
                        Network
                      </p>

                      <p className="mt-0.5 text-xs font-medium text-foreground sm:text-sm">
                        {withdrawal.network}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  {isPending && (
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() =>
                          handleAction(
                            withdrawal.id,
                            "REJECT",
                          )
                        }
                        disabled={isLoading}
                        className="h-10 border-custom3 text-sm font-medium"
                      >
                        {isLoading
                          ? "Processing..."
                          : "Reject"}
                      </Button>

                      <Button
                        type="button"
                        onClick={() =>
                          handleAction(
                            withdrawal.id,
                            "APPROVE",
                          )
                        }
                        disabled={isLoading}
                        className="h-10 border-custom text-sm font-medium"
                      >
                        {isLoading
                          ? "Processing..."
                          : "Approve"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WithdrawalManagement;
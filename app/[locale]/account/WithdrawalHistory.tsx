"use client";

import { useLocale, useTranslations } from "next-intl";

import { FiArrowDownLeft } from "react-icons/fi";
import {
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
} from "react-icons/hi";

interface Withdrawal {
  id: string;
  amount: number;
  method?: string | null;
  provider?: string | null;
  destination?: string | null;
  network?: string | null;
  // Kept for older withdrawals
  phoneNumber?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

interface WithdrawalHistoryProps {
  withdrawals: Withdrawal[];
}

const statusConfig = {
  PENDING: {
    key: "pending",
    icon: HiOutlineClock,
    className:
      "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
  },
  APPROVED: {
    key: "approved",
    icon: HiOutlineCheckCircle,
    className:
      "border-primary/20 bg-primary/10 text-primary",
  },
  REJECTED: {
    key: "rejected",
    icon: HiOutlineXCircle,
    className:
      "border-destructive/20 bg-destructive/10 text-destructive",
  },
} as const;

const methodLabels: Record<string, string> = {
  MOBILE_MONEY: "Mobile Money",
  CRYPTO: "Cryptocurrency",
  CARD: "Bank Card",
  LOCAL_WALLET: "Local Wallet",
};

const WithdrawalHistory = ({
  withdrawals,
}: WithdrawalHistoryProps) => {
  const t = useTranslations("Account.history");
  const locale = useLocale();

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat(locale, {
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

  const getDetails = (
    withdrawal: Withdrawal,
  ) => {
    // New withdrawal records
    if (withdrawal.method) {
      const method = getMethodLabel(
        withdrawal.method,
      );

      if (withdrawal.network) {
        return `${method} · ${
          withdrawal.provider ?? ""
        } · ${withdrawal.network}`;
      }

      return `${method} · ${
        withdrawal.provider ?? ""
      }`;
    }

    // Old withdrawal records
    if (withdrawal.network) {
      return withdrawal.network;
    }

    return "Withdrawal";
  };

  const getDestination = (
    withdrawal: Withdrawal,
  ) => {
    // New records
    if (withdrawal.destination) {
      return withdrawal.destination;
    }

    // Old records
    if (withdrawal.phoneNumber) {
      return withdrawal.phoneNumber;
    }

    return "—";
  };

  return (
    <section className="mt-7 rounded-xl border-custom2 bg-card">
      {/* Header */}
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <h2 className="text-sm font-semibold text-foreground">
          {t("title")}
        </h2>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {t("description")}
        </p>
      </div>

      {/* Empty State */}
      {withdrawals.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 py-10 text-center sm:px-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FiArrowDownLeft
              size={22}
              className="text-muted-foreground"
              aria-hidden="true"
            />
          </div>

          <h3 className="mt-3 text-sm font-semibold text-foreground">
            {t("emptyTitle")}
          </h3>

          <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
            {t("emptyDescription")}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {withdrawals.map((withdrawal) => {
            const status =
              statusConfig[withdrawal.status];

            const StatusIcon = status.icon;

            return (
              <div
                key={withdrawal.id}
                className="px-5 py-4 sm:px-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {/* Withdrawal Details */}
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <FiArrowDownLeft
                        size={18}
                        className="text-primary"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        $
                        {withdrawal.amount.toFixed(
                          2,
                        )}
                      </p>

                      <p className="mt-0.5 truncate text-[11px] text-muted-foreground sm:text-xs">
                        {getDetails(withdrawal)}
                      </p>

                      <p className="mt-0.5 truncate text-[11px] text-muted-foreground sm:text-xs">
                        {getDestination(
                          withdrawal,
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Status + Date */}
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium sm:text-xs ${status.className}`}
                    >
                      <StatusIcon
                        size={13}
                        aria-hidden="true"
                      />

                      {t(
                        `status.${status.key}`,
                      )}
                    </span>

                    <span className="whitespace-nowrap text-[11px] text-muted-foreground sm:text-xs">
                      {formatDate(
                        withdrawal.createdAt,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default WithdrawalHistory;
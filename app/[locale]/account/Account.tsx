"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import toast from "react-hot-toast";

import CurrencyDisplay from "@/components/currency/CurrencyDisplay";

import {
  FiArrowRight,
  FiCheckCircle,
  FiCreditCard,
  FiInfo,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";

import { SafeUser } from "@/types";

import {
  withdraw,
  type WithdrawalMethod,
} from "@/actions/Withdraw";

import { withdrawalMethods } from "@/config/walletConfig";

import { formatPrice } from "@/utils/formatPrice";

import WithdrawalHistory from "./WithdrawalHistory";

interface Withdrawal {
  id: string;
  amount: number;
  phoneNumber: string | null;
  method?: string | null;
  provider?: string | null;
  destination?: string | null;
  network?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

interface AccountProps {
  currentUser: SafeUser | null;
  withdrawals: Withdrawal[];
}

const MIN_WITHDRAWAL = 5;
const MAX_WITHDRAWAL = 600;

const Account = ({
  currentUser,
  withdrawals,
}: AccountProps) => {
  const t = useTranslations("Account");
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [withdrawalMethod, setWithdrawalMethod] =
    useState<WithdrawalMethod | "">("");
  const [provider, setProvider] = useState("");
  const [network, setNetwork] = useState("");
  const [destination, setDestination] = useState("");

  const [showConfirmation, setShowConfirmation] =
    useState(false);
  const [withdrawalComplete, setWithdrawalComplete] =
    useState(false);
  const [isWithdrawing, setIsWithdrawing] =
    useState(false);

  const [completedWithdrawal, setCompletedWithdrawal] =
    useState<Withdrawal | null>(null);

  const isTradingActive = Boolean(
    currentUser?.tradingstatus
  );

  const isClearanceApproved = Boolean(
    currentUser?.clearancestatus
  );

  const balance = Number(
    currentUser?.TotalBalance ?? 0
  );

  const withdrawalAmount = Number(amount);

  const availableProviders = useMemo(() => {
    if (!withdrawalMethod) return [];

    const methodConfig =
      withdrawalMethods[withdrawalMethod];

    const country =
      currentUser?.country?.toUpperCase();

    return methodConfig.providers.filter((item) => {
      if (!("countries" in item) || !item.countries) {
        return true;
      }

      if (!country) {
        return false;
      }

      return item.countries.some(
        (allowedCountry) =>
          allowedCountry === country
      );
    });
  }, [
    currentUser?.country,
    withdrawalMethod,
  ]);

  const selectedProvider = useMemo(() => {
    if (!withdrawalMethod || !provider) {
      return null;
    }

    const methodConfig =
      withdrawalMethods[withdrawalMethod];

    return (
      methodConfig.providers.find(
        (item) => item.key === provider
      ) ?? null
    );
  }, [provider, withdrawalMethod]);

  const availableNetworks = useMemo(() => {
    if (
      !selectedProvider ||
      !("networks" in selectedProvider)
    ) {
      return [];
    }

    return selectedProvider.networks;
  }, [selectedProvider]);

  const amountError = useMemo(() => {
    if (!amount) return null;

    if (
      !Number.isFinite(withdrawalAmount) ||
      withdrawalAmount <= 0
    ) {
      return t(
        "withdrawal.validation.invalidAmount"
      );
    }

    if (withdrawalAmount < MIN_WITHDRAWAL) {
      return t("withdrawal.validation.minimum");
    }

    if (withdrawalAmount > MAX_WITHDRAWAL) {
      return t("withdrawal.validation.maximum");
    }

    if (withdrawalAmount > balance) {
      return t(
        "withdrawal.validation.exceedsBalance"
      );
    }

    return null;
  }, [
    amount,
    balance,
    t,
    withdrawalAmount,
  ]);

  const providerError = useMemo(() => {
    if (!withdrawalMethod) return null;

    if (!provider) {
      return "Please select a provider.";
    }

    return null;
  }, [provider, withdrawalMethod]);

  const networkError = useMemo(() => {
    if (withdrawalMethod !== "CRYPTO") {
      return null;
    }

    if (!network) {
      return "Please select a network.";
    }

    return null;
  }, [network, withdrawalMethod]);

  const destinationError = useMemo(() => {
    if (!destination) return null;

    if (destination.trim().length < 3) {
      return "Please enter a valid withdrawal destination.";
    }

    return null;
  }, [destination]);

  const canWithdraw =
    balance > 0 &&
    isClearanceApproved &&
    Boolean(amount) &&
    !amountError &&
    withdrawalAmount >= MIN_WITHDRAWAL &&
    withdrawalAmount <= MAX_WITHDRAWAL &&
    withdrawalAmount <= balance &&
    Boolean(withdrawalMethod) &&
    !providerError &&
    !networkError &&
    Boolean(destination.trim()) &&
    !destinationError;

  const handleAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleMethodChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value =
      event.target.value as
        | WithdrawalMethod
        | "";

    setWithdrawalMethod(value);
    setProvider("");
    setNetwork("");
    setDestination("");
  };

  const handleProviderChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setProvider(event.target.value);
    setNetwork("");
  };

  const handleNetworkChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setNetwork(event.target.value);
  };

  const handleDestinationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDestination(event.target.value);
  };

  const handleWithdraw = () => {
    if (!canWithdraw) return;

    setShowConfirmation(true);
  };

  const handleConfirmWithdrawal = async () => {
    if (
      !canWithdraw ||
      !withdrawalMethod ||
      !provider
    ) {
      return;
    }

    setIsWithdrawing(true);

    try {
      const result = await withdraw({
        amount: withdrawalAmount,
        method: withdrawalMethod,
        provider,
        destination: destination.trim(),
        network:
          withdrawalMethod === "CRYPTO"
            ? network
            : undefined,
      });

      if (!result?.success) {
        toast.error(
          result?.message ||
            t("withdrawal.errors.generic")
        );
        return;
      }

      const newWithdrawal: Withdrawal = {
        id: result.withdrawalId,
        amount: withdrawalAmount,
        phoneNumber:
          withdrawalMethod === "MOBILE_MONEY"
            ? destination.trim()
            : null,
        method: withdrawalMethod,
        provider,
        destination: destination.trim(),
        network:
          withdrawalMethod === "CRYPTO"
            ? network
            : null,
        status: "PENDING",
        createdAt: new Date().toISOString(),
      };

      setCompletedWithdrawal(newWithdrawal);
      setShowConfirmation(false);
      setWithdrawalComplete(true);

      router.refresh();
    } catch {
      toast.error(
        t("withdrawal.errors.generic")
      );
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleCloseSuccess = () => {
    setWithdrawalComplete(false);
    setCompletedWithdrawal(null);
    setAmount("");
    setWithdrawalMethod("");
    setProvider("");
    setNetwork("");
    setDestination("");
  };

  const methodLabel = withdrawalMethod
    ? withdrawalMethods[withdrawalMethod].label
    : "";

  const providerLabel =
    selectedProvider?.label ?? provider;

  return (
    <main className="w-full py-8 sm:py-10 lg:py-12">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-7 sm:mb-8">
          <p className="text-xs font-medium text-primary sm:text-sm">
            {t("welcome")}
          </p>

          <h1 className="mt-1 text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl lg:text-3xl">
            {t("goodToSeeYou", {
              name: currentUser?.name ?? "",
            })}
          </h1>
        </div>

        {/* Balance Cards */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Balance */}
          <div className="rounded-xl border-custom2 bg-background p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground sm:text-sm">
                {t("balance.total")}
              </span>

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FiCreditCard size={17} aria-hidden="true" />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {formatPrice(balance)}
              </p>

              <CurrencyDisplay
                amount={balance}
                country={currentUser?.country}
              />
            </div>
          </div>

          {/* Leverage */}
          <div className="rounded-xl border-custom2 bg-background p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground sm:text-sm">
                {t("balance.leverage")}
              </span>

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FiTrendingUp size={17} aria-hidden="true" />
              </div>
            </div>

            <p className="mt-4 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              1:100 M
            </p>
          </div>

          {/* Invested Value */}
          <div className="rounded-xl border-custom2 bg-background p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground sm:text-sm">
                {t("balance.investedValue")}
              </span>

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MdOutlineAccountBalanceWallet
                  size={18}
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {formatPrice(currentUser?.Deposit)}
              </p>

              <CurrencyDisplay
                amount={Number(
                  currentUser?.Deposit ?? 0
                )}
                country={currentUser?.country}
              />
            </div>
          </div>

          {/* Target Profit */}
          <div className="rounded-xl border-custom2 bg-background p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground sm:text-sm">
                {t("balance.targetProfit")}
              </span>

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FiTrendingUp size={17} aria-hidden="true" />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {formatPrice(currentUser?.Profit)}
              </p>

              <CurrencyDisplay
                amount={Number(
                  currentUser?.Profit ?? 0
                )}
                country={currentUser?.country}
              />
            </div>
          </div>
        </section>

        {/* Withdrawal Section */}
        <section className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_0.6fr]">
          {/* Withdrawal Form */}
          <div className="rounded-xl border-custom2 bg-background p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                  {t("withdrawal.title")}
                </h2>

                <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
                  {t("withdrawal.description")}
                </p>
              </div>

              <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:flex">
                <FiCreditCard
                  size={18}
                  aria-hidden="true"
                />
              </div>
            </div>

            {!isClearanceApproved ? (
              <div className="mt-5 rounded-lg border border-border bg-muted/30 p-3.5">
                <div className="flex items-start gap-3">
                  <FiShield
                    size={18}
                    className="mt-0.5 shrink-0 text-primary"
                    aria-hidden="true"
                  />

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {t("withdrawal.unavailable")}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
                      {t(
                        "withdrawal.clearanceRestriction"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ) : balance <= 0 ? (
              <div className="mt-5 rounded-lg border border-border bg-muted/30 p-3.5">
                <div className="flex items-start gap-3">
                  <FiInfo
                    size={18}
                    className="mt-0.5 shrink-0 text-primary"
                    aria-hidden="true"
                  />

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {t("withdrawal.noBalance")}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
                      {t(
                        "withdrawal.noBalanceDescription"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {/* Amount */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor="withdrawal-amount"
                      className="text-xs font-medium text-foreground sm:text-sm"
                    >
                      {t("withdrawal.amount")}
                    </label>

                    <span className="text-[11px] text-muted-foreground sm:text-xs">
                      {t("withdrawal.available", {
                        amount: formatPrice(balance),
                      })}
                    </span>
                  </div>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                      $
                    </span>

                    <input
                      id="withdrawal-amount"
                      type="text"
                      inputMode="decimal"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder={t(
                        "withdrawal.placeholder"
                      )}
                      className={`h-11 w-full rounded-lg border-custom bg-background pl-8 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                        amountError
                          ? "border-destructive"
                          : ""
                      }`}
                    />
                  </div>

                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground sm:text-xs">
                    <span>
                      {t("withdrawal.minimum")}
                    </span>
                    <span>
                      {t("withdrawal.maximum")}
                    </span>
                  </div>

                  {amountError && (
                    <p className="mt-1.5 text-xs text-destructive">
                      {amountError}
                    </p>
                  )}
                </div>

                {/* Withdrawal Method */}
                <div>
                  <label
                    htmlFor="withdrawal-method"
                    className="mb-2 block text-xs font-medium text-foreground sm:text-sm"
                  >
                    Withdrawal Method
                  </label>

                  <select
                    id="withdrawal-method"
                    value={withdrawalMethod}
                    onChange={handleMethodChange}
                    className="h-11 w-full rounded-lg border-custom bg-background px-3.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                  >
                    <option value="">
                      Select withdrawal method
                    </option>

                    {(
                      Object.entries(
                        withdrawalMethods
                      ) as [
                        WithdrawalMethod,
                        (typeof withdrawalMethods)[WithdrawalMethod]
                      ][]
                    ).map(([key, method]) => (
                      <option
                        key={key}
                        value={key}
                      >
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Provider */}
                {withdrawalMethod && (
                  <div>
                    <label
                      htmlFor="withdrawal-provider"
                      className="mb-2 block text-xs font-medium text-foreground sm:text-sm"
                    >
                      Provider
                    </label>

                    <select
                      id="withdrawal-provider"
                      value={provider}
                      onChange={handleProviderChange}
                      className={`h-11 w-full rounded-lg border-custom bg-background px-3.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                        providerError
                          ? "border-destructive"
                          : ""
                      }`}
                    >
                      <option value="">
                        Select provider
                      </option>

                      {availableProviders.map(
                        (item) => (
                          <option
                            key={item.key}
                            value={item.key}
                          >
                            {item.label}
                          </option>
                        )
                      )}
                    </select>

                    {availableProviders.length ===
                      0 && (
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        No providers are currently
                        available for your country.
                      </p>
                    )}

                    {providerError && (
                      <p className="mt-1.5 text-xs text-destructive">
                        {providerError}
                      </p>
                    )}
                  </div>
                )}

                {/* Crypto Network */}
                {withdrawalMethod ===
                  "CRYPTO" &&
                  provider && (
                    <div>
                      <label
                        htmlFor="withdrawal-network"
                        className="mb-2 block text-xs font-medium text-foreground sm:text-sm"
                      >
                        Network
                      </label>

                      <select
                        id="withdrawal-network"
                        value={network}
                        onChange={handleNetworkChange}
                        className={`h-11 w-full rounded-lg border-custom bg-background px-3.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                          networkError
                            ? "border-destructive"
                            : ""
                        }`}
                      >
                        <option value="">
                          Select network
                        </option>

                        {availableNetworks.map(
                          (networkOption) => (
                            <option
                              key={networkOption}
                              value={networkOption}
                            >
                              {networkOption}
                            </option>
                          )
                        )}
                      </select>

                      {networkError && (
                        <p className="mt-1.5 text-xs text-destructive">
                          {networkError}
                        </p>
                      )}
                    </div>
                  )}

                {/* Destination */}
                {withdrawalMethod &&
                  provider && (
                    <div>
                      <label
                        htmlFor="withdrawal-destination"
                        className="mb-2 block text-xs font-medium text-foreground sm:text-sm"
                      >
                        {withdrawalMethod ===
                        "MOBILE_MONEY"
                          ? "Mobile Money Number"
                          : withdrawalMethod ===
                              "CRYPTO"
                            ? "Wallet Address"
                            : withdrawalMethod ===
                                "LOCAL_WALLET"
                              ? "Wallet / Account Number"
                              : "Payout Reference"}
                      </label>

                      <input
                        id="withdrawal-destination"
                        type="text"
                        value={destination}
                        onChange={
                          handleDestinationChange
                        }
                        placeholder={
                          withdrawalMethod ===
                          "MOBILE_MONEY"
                            ? "Enter mobile money number"
                            : withdrawalMethod ===
                                "CRYPTO"
                              ? "Enter wallet address"
                              : withdrawalMethod ===
                                  "LOCAL_WALLET"
                                ? "Enter wallet or account number"
                                : "Enter your payout reference"
                        }
                        className={`h-11 w-full rounded-lg border-custom bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                          destinationError
                            ? "border-destructive"
                            : ""
                        }`}
                      />

                      {destinationError && (
                        <p className="mt-1.5 text-xs text-destructive">
                          {destinationError}
                        </p>
                      )}

                      {/* Crypto Warning */}
                      {withdrawalMethod ===
                        "CRYPTO" && (
                        <div className="mt-3 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                          <FiInfo
                            className="mt-0.5 shrink-0"
                            aria-hidden="true"
                          />

                          <p>
                            Make sure the wallet
                            address and selected
                            network are correct.
                            Crypto transfers may not
                            be reversible.
                          </p>
                        </div>
                      )}

                      {/* Card Warning */}
                      {withdrawalMethod ===
                        "CARD" && (
                        <div className="mt-3 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                          <FiCreditCard
                            className="mt-0.5 shrink-0"
                            aria-hidden="true"
                          />

                          <p>
                            Do not enter your full
                            card number, CVV, PIN, or
                            other sensitive card
                            details here. Use the payout
                            reference provided by your
                            supported payment provider.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                {/* Withdraw Button */}
                <button
                  type="button"
                  onClick={handleWithdraw}
                  disabled={!canWithdraw}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("withdrawal.button")}
                  <FiArrowRight
                    size={16}
                    aria-hidden="true"
                  />
                </button>
              </div>
            )}
          </div>

          {/* Withdrawal Information */}
          <div className="rounded-xl border-custom2 bg-background p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FiInfo
                  size={18}
                  aria-hidden="true"
                />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-foreground sm:text-base">
                  {t(
                    "withdrawal.information.title"
                  )}
                </h2>

                <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
                  {t(
                    "withdrawal.information.description"
                  )}
                </p>
              </div>
            </div>

            <div className="mt-5 divide-y divide-border">
              {/* Available Balance */}
              <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0">
                <span className="text-xs text-muted-foreground sm:text-sm">
                  {t(
                    "withdrawal.information.availableBalance"
                  )}
                </span>

                <div className="text-right">
                  <span className="block text-sm font-semibold text-foreground">
                    {formatPrice(balance)}
                  </span>

                  <CurrencyDisplay
                    amount={balance}
                    country={currentUser?.country}
                  />
                </div>
              </div>

              {/* Minimum */}
              <div className="flex items-center justify-between gap-4 py-3.5">
                <span className="text-xs text-muted-foreground sm:text-sm">
                  {t(
                    "withdrawal.information.minimum"
                  )}
                </span>

                <div className="text-right">
                  <span className="block text-sm font-semibold text-foreground">
                    $5
                  </span>

                  <CurrencyDisplay
                    amount={MIN_WITHDRAWAL}
                    country={currentUser?.country}
                  />
                </div>
              </div>

              {/* Maximum */}
              <div className="flex items-center justify-between gap-4 py-3.5">
                <span className="text-xs text-muted-foreground sm:text-sm">
                  {t(
                    "withdrawal.information.maximum"
                  )}
                </span>

                <div className="text-right">
                  <span className="block text-sm font-semibold text-foreground">
                    $600
                  </span>

                  <CurrencyDisplay
                    amount={MAX_WITHDRAWAL}
                    country={currentUser?.country}
                  />
                </div>
              </div>

              {/* Available Methods */}
              <div className="py-3.5 last:pb-0">
                <span className="text-xs text-muted-foreground sm:text-sm">
                  Available Methods
                </span>

                <div className="mt-2.5 space-y-1.5">
                  {(
                    Object.entries(
                      withdrawalMethods
                    ) as [
                      WithdrawalMethod,
                      (typeof withdrawalMethods)[WithdrawalMethod]
                    ][]
                  ).map(([key, method]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2"
                    >
                      <span className="text-xs font-medium text-foreground">
                        {method.label}
                      </span>

                      <span className="text-[11px] text-muted-foreground sm:text-xs">
                        {method.providers.length}{" "}
                        {method.providers.length === 1
                          ? "provider"
                          : "providers"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Account Overview */}
        <section className="mt-7 rounded-xl border-custom2 bg-background p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {t("overview.title")}
            </h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
              {t("overview.description")}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Trading Status */}
            <div className="rounded-lg border-custom bg-muted/20 p-3.5">
              <span className="text-[11px] text-muted-foreground sm:text-xs">
                {t("overview.tradingStatus")}
              </span>

              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isTradingActive
                      ? "bg-primary"
                      : "bg-muted-foreground"
                  }`}
                />

                <span className="text-xs font-medium text-foreground sm:text-sm">
                  {isTradingActive
                    ? t("overview.active")
                    : t("overview.inactive")}
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="rounded-lg border-custom bg-muted/20 p-3.5">
              <span className="text-[11px] text-muted-foreground sm:text-xs">
                {t("overview.email")}
              </span>

              <p className="mt-2 truncate text-xs font-medium text-foreground sm:text-sm">
                {currentUser?.email ||
                  t("overview.notProvided")}
              </p>
            </div>

            {/* Phone Number */}
            <div className="rounded-lg border-custom bg-muted/20 p-3.5">
              <span className="text-[11px] text-muted-foreground sm:text-xs">
                {t("overview.phoneNumber")}
              </span>

              <p className="mt-2 text-xs font-medium text-foreground sm:text-sm">
                {currentUser?.number ||
                  t("overview.notProvided")}
              </p>
            </div>

            {/* Clearance Status */}
            <div className="rounded-lg border-custom bg-muted/20 p-3.5">
              <span className="text-[11px] text-muted-foreground sm:text-xs">
                {t("overview.clearanceStatus")}
              </span>

              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isClearanceApproved
                      ? "bg-primary"
                      : "bg-muted-foreground"
                  }`}
                />

                <span className="text-xs font-medium text-foreground sm:text-sm">
                  {isClearanceApproved
                    ? t("overview.approved")
                    : t("overview.notApproved")}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Withdrawal History */}
        <section className="mt-7">
          <WithdrawalHistory
            withdrawals={withdrawals}
          />
        </section>
      </div>

      {/* Withdrawal Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-5 py-8 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-background p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                  Confirm Withdrawal
                </h2>

                <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
                  Please review your withdrawal
                  details before confirming.
                </p>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FiShield
                  size={18}
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-lg border border-border">
              {/* Amount */}
              <div className="flex items-center justify-between gap-4 border-b border-border px-3.5 py-3">
                <span className="text-xs text-muted-foreground sm:text-sm">
                  Amount
                </span>

                <div className="text-right">
                  <span className="block text-sm font-semibold text-foreground">
                    {formatPrice(
                      withdrawalAmount
                    )}
                  </span>

                  <CurrencyDisplay
                    amount={withdrawalAmount}
                    country={currentUser?.country}
                  />
                </div>
              </div>

              {/* Method */}
              <div className="flex items-center justify-between gap-4 border-b border-border px-3.5 py-3">
                <span className="text-xs text-muted-foreground sm:text-sm">
                  Method
                </span>

                <span className="text-right text-xs font-semibold text-foreground sm:text-sm">
                  {methodLabel}
                </span>
              </div>

              {/* Provider */}
              <div className="flex items-center justify-between gap-4 border-b border-border px-3.5 py-3">
                <span className="text-xs text-muted-foreground sm:text-sm">
                  Provider
                </span>

                <span className="text-right text-xs font-semibold text-foreground sm:text-sm">
                  {providerLabel}
                </span>
              </div>

              {/* Network */}
              {withdrawalMethod ===
                "CRYPTO" &&
                network && (
                  <div className="flex items-center justify-between gap-4 border-b border-border px-3.5 py-3">
                    <span className="text-xs text-muted-foreground sm:text-sm">
                      Network
                    </span>

                    <span className="text-xs font-semibold text-foreground sm:text-sm">
                      {network}
                    </span>
                  </div>
                )}

              {/* Destination */}
              <div className="px-3.5 py-3">
                <span className="text-[11px] text-muted-foreground sm:text-xs">
                  {withdrawalMethod ===
                  "MOBILE_MONEY"
                    ? "Mobile Money Number"
                    : withdrawalMethod ===
                        "CRYPTO"
                      ? "Wallet Address"
                      : withdrawalMethod ===
                          "LOCAL_WALLET"
                        ? "Wallet / Account Number"
                        : "Payout Reference"}
                </span>

                <p className="mt-1 break-all text-xs font-semibold text-foreground sm:text-sm">
                  {destination}
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-start gap-2.5">
                <FiInfo
                  size={16}
                  className="mt-0.5 shrink-0 text-primary"
                  aria-hidden="true"
                />

                <p className="text-[11px] leading-5 text-muted-foreground sm:text-xs">
                  Your withdrawal will be submitted
                  for processing after confirmation.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() =>
                  setShowConfirmation(false)
                }
                disabled={isWithdrawing}
                className="h-10 rounded-lg border-custom px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleConfirmWithdrawal
                }
                disabled={isWithdrawing}
                className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isWithdrawing
                  ? "Processing..."
                  : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Success Modal */}
      {withdrawalComplete &&
        completedWithdrawal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-5 py-8 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl border border-border bg-background p-5 text-center shadow-2xl sm:p-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FiCheckCircle
                  size={28}
                  aria-hidden="true"
                />
              </div>

              <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                Withdrawal Submitted
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
                Your withdrawal request has been
                submitted successfully and is now
                pending processing.
              </p>

              <div className="mt-5 overflow-hidden rounded-lg border border-border text-left">
                {/* Amount */}
                <div className="flex items-center justify-between gap-4 border-b border-border px-3.5 py-3">
                  <span className="text-xs text-muted-foreground sm:text-sm">
                    Amount
                  </span>

                  <div className="text-right">
                    <span className="block text-sm font-semibold text-foreground">
                      {formatPrice(
                        completedWithdrawal.amount
                      )}
                    </span>

                    <CurrencyDisplay
                      amount={
                        completedWithdrawal.amount
                      }
                      country={
                        currentUser?.country
                      }
                    />
                  </div>
                </div>

                {/* Method */}
                <div className="flex items-center justify-between gap-4 border-b border-border px-3.5 py-3">
                  <span className="text-xs text-muted-foreground sm:text-sm">
                    Method
                  </span>

                  <span className="text-right text-xs font-semibold text-foreground sm:text-sm">
                    {completedWithdrawal.method
                      ? withdrawalMethods[
                          completedWithdrawal
                            .method as WithdrawalMethod
                        ]?.label ??
                        completedWithdrawal.method
                      : "-"}
                  </span>
                </div>

                {/* Provider */}
                <div className="flex items-center justify-between gap-4 border-b border-border px-3.5 py-3">
                  <span className="text-xs text-muted-foreground sm:text-sm">
                    Provider
                  </span>

                  <span className="text-right text-xs font-semibold text-foreground sm:text-sm">
                    {completedWithdrawal.provider ??
                      "-"}
                  </span>
                </div>

                {/* Network */}
                {completedWithdrawal.network && (
                  <div className="flex items-center justify-between gap-4 border-b border-border px-3.5 py-3">
                    <span className="text-xs text-muted-foreground sm:text-sm">
                      Network
                    </span>

                    <span className="text-xs font-semibold text-foreground sm:text-sm">
                      {completedWithdrawal.network}
                    </span>
                  </div>
                )}

                {/* Destination */}
                <div className="px-3.5 py-3">
                  <span className="text-[11px] text-muted-foreground sm:text-xs">
                    Destination
                  </span>

                  <p className="mt-1 break-all text-xs font-semibold text-foreground sm:text-sm">
                    {completedWithdrawal.destination ??
                      "-"}
                  </p>
                </div>

                {/* Remaining Balance */}
                <div className="flex items-center justify-between gap-4 border-t border-border px-3.5 py-3">
                  <span className="text-xs text-muted-foreground sm:text-sm">
                    Remaining Balance
                  </span>

                  <div className="text-right">
                    <span className="block text-sm font-semibold text-foreground">
                      {formatPrice(
                        Math.max(
                          0,
                          balance -
                            completedWithdrawal.amount
                        )
                      )}
                    </span>

                    <CurrencyDisplay
                      amount={Math.max(
                        0,
                        balance -
                          completedWithdrawal.amount
                      )}
                      country={
                        currentUser?.country
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
                <div className="flex items-start gap-2 text-left">
                  <FiInfo
                    size={15}
                    className="mt-0.5 shrink-0 text-primary"
                    aria-hidden="true"
                  />

                  <p className="text-[11px] leading-5 text-muted-foreground sm:text-xs">
                    Your withdrawal is currently
                    pending and will be processed
                    after review.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseSuccess}
                className="mt-5 h-10 w-full rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Done
              </button>
            </div>
          </div>
        )}
    </main>
  );
};

export default Account;
"use client";

import { useMemo, useState } from "react";

import { FiEdit3, FiSearch, FiTrash2 } from "react-icons/fi";

import toast from "react-hot-toast";

import {
  deleteUser,
  updateUserFinancials,
  updateUserStatus,
} from "@/actions/AdminUsers";

import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  TotalBalance: number | null;
  Deposit: number | null;
  Profit: number | null;
  tradingstatus: boolean;
  clearancestatus: boolean;
  role: "USER" | "ADMIN";
  createdAt: string;
}

interface UserManagementProps {
  users: User[];
}

const UserManagement = ({
  users,
}: UserManagementProps) => {
  const [search, setSearch] = useState("");
  const [loadingUserId, setLoadingUserId] = useState<
    string | null
  >(null);
  const [editingUserId, setEditingUserId] = useState<
    string | null
  >(null);

  const [financialValues, setFinancialValues] = useState({
    TotalBalance: "",
    Deposit: "",
    Profit: "",
  });

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
      );
    });
  }, [search, users]);

  const handleStatusChange = async (
    userId: string,
    field: "tradingstatus" | "clearancestatus",
    value: boolean,
  ) => {
    setLoadingUserId(userId);

    try {
      const result = await updateUserStatus({
        userId,
        field,
        value,
      });

      if (result.success) {
        toast.success(result.message);
        window.location.reload();
        return;
      }

      toast.error(result.message);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingUserId(null);
    }
  };

  const openFinancialEditor = (user: User) => {
    setEditingUserId(user.id);

    setFinancialValues({
      TotalBalance: String(user.TotalBalance ?? 0),
      Deposit: String(user.Deposit ?? 0),
      Profit: String(user.Profit ?? 0),
    });
  };

  const closeFinancialEditor = () => {
    setEditingUserId(null);

    setFinancialValues({
      TotalBalance: "",
      Deposit: "",
      Profit: "",
    });
  };

  const handleFinancialChange = (
    field: "TotalBalance" | "Deposit" | "Profit",
    value: string,
  ) => {
    setFinancialValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleFinancialSave = async () => {
    if (!editingUserId) {
      return;
    }

    const TotalBalance = Number(
      financialValues.TotalBalance,
    );

    const Deposit = Number(
      financialValues.Deposit,
    );

    const Profit = Number(
      financialValues.Profit,
    );

    if (
      !Number.isFinite(TotalBalance) ||
      !Number.isFinite(Deposit) ||
      !Number.isFinite(Profit)
    ) {
      toast.error("Please enter valid financial values.");
      return;
    }

    if (
      !Number.isInteger(TotalBalance) ||
      !Number.isInteger(Deposit) ||
      !Number.isInteger(Profit)
    ) {
      toast.error("Financial values must be whole numbers.");
      return;
    }

    if (
      TotalBalance < 0 ||
      Deposit < 0 ||
      Profit < 0
    ) {
      toast.error("Financial values cannot be negative.");
      return;
    }

    setLoadingUserId(editingUserId);

    try {
      const result = await updateUserFinancials({
        userId: editingUserId,
        TotalBalance,
        Deposit,
        Profit,
      });

      if (result.success) {
        toast.success(result.message);
        window.location.reload();
        return;
      }

      toast.error(result.message);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleDeleteUser = async (user: User) => {
    const userName =
      user.name || user.email || "this user";

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${userName}?\n\nThis will remove the user account and all related withdrawal and authentication records. This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setLoadingUserId(user.id);

    try {
      const result = await deleteUser(user.id);

      if (result.success) {
        toast.success(result.message);
        window.location.reload();
        return;
      }

      toast.error(result.message);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingUserId(null);
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
          User Management
        </h1>

        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
          Manage user accounts, trading access, clearance status,
          and financial information.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <FiSearch
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />

        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search by name or email..."
          className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>

      {/* Result Count */}
      <div className="mb-4 text-xs text-muted-foreground">
        {filteredUsers.length}{" "}
        {filteredUsers.length === 1 ? "user" : "users"}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 ? (
        <div className="rounded-xl border-custom2 bg-card px-5 py-10 text-center">
          <h2 className="text-sm font-semibold text-foreground">
            No users found
          </h2>

          <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
            Try searching with a different name or email address.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredUsers.map((user) => {
            const isLoading =
              loadingUserId === user.id;

            const isEditing =
              editingUserId === user.id;

            return (
              <div
                key={user.id}
                className="rounded-xl border-custom2 bg-card p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4">
                  {/* User Header */}
                  <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-sm font-semibold text-foreground sm:text-base">
                          {user.name || "Unnamed User"}
                        </h2>

                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                            user.role === "ADMIN"
                              ? "border-primary/20 bg-primary/10 text-primary"
                              : "border-border bg-muted text-muted-foreground"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>

                      <p className="mt-0.5 break-all text-xs text-muted-foreground">
                        {user.email || "No email address"}
                      </p>
                    </div>

                    <span className="text-[11px] text-muted-foreground sm:pt-0.5">
                      Joined{" "}
                      {new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                      }).format(
                        new Date(user.createdAt),
                      )}
                    </span>
                  </div>

                  {/* Financial Overview */}
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    <div className="rounded-lg border border-border bg-background p-3.5">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        Total Balance
                      </span>

                      <p className="mt-1 text-base font-semibold tracking-tight text-foreground">
                        $
                        {(
                          user.TotalBalance ?? 0
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-3.5">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        Deposit
                      </span>

                      <p className="mt-1 text-base font-semibold tracking-tight text-foreground">
                        $
                        {(
                          user.Deposit ?? 0
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-3.5">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        Profit
                      </span>

                      <p className="mt-1 text-base font-semibold tracking-tight text-primary">
                        $
                        {(
                          user.Profit ?? 0
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Account Status */}
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background px-3.5 py-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground">
                          Trading Status
                        </p>

                        <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">
                          Allow this user to trade.
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={
                          user.tradingstatus
                        }
                        aria-label={`Trading status for ${
                          user.name ||
                          user.email ||
                          "user"
                        }`}
                        disabled={isLoading}
                        onClick={() =>
                          handleStatusChange(
                            user.id,
                            "tradingstatus",
                            !user.tradingstatus,
                          )
                        }
                        className={`relative flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60 ${
                          user.tradingstatus
                            ? "bg-primary"
                            : "bg-muted-foreground/30"
                        }`}
                      >
                        <span
                          className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            user.tradingstatus
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background px-3.5 py-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground">
                          Clearance Status
                        </p>

                        <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">
                          Allow this user to make withdrawals.
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={
                          user.clearancestatus
                        }
                        aria-label={`Clearance status for ${
                          user.name ||
                          user.email ||
                          "user"
                        }`}
                        disabled={isLoading}
                        onClick={() =>
                          handleStatusChange(
                            user.id,
                            "clearancestatus",
                            !user.clearancestatus,
                          )
                        }
                        className={`relative flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60 ${
                          user.clearancestatus
                            ? "bg-primary"
                            : "bg-muted-foreground/30"
                        }`}
                      >
                        <span
                          className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            user.clearancestatus
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Financial Editor */}
                  {isEditing ? (
                    <div className="rounded-lg border border-border bg-background p-3.5 sm:p-4">
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <label className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
                            Total Balance
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={
                              financialValues.TotalBalance
                            }
                            onChange={(event) =>
                              handleFinancialChange(
                                "TotalBalance",
                                event.target.value,
                              )
                            }
                            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
                            Deposit
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={
                              financialValues.Deposit
                            }
                            onChange={(event) =>
                              handleFinancialChange(
                                "Deposit",
                                event.target.value,
                              )
                            }
                            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
                            Profit
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={
                              financialValues.Profit
                            }
                            onChange={(event) =>
                              handleFinancialChange(
                                "Profit",
                                event.target.value,
                              )
                            }
                            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={closeFinancialEditor}
                          disabled={isLoading}
                          className="h-10 border-custom2 text-sm font-medium"
                        >
                          Cancel
                        </Button>

                        <Button
                          type="button"
                          onClick={handleFinancialSave}
                          disabled={isLoading}
                          className="h-10 border-custom text-sm font-medium"
                        >
                          {isLoading
                            ? "Saving..."
                            : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Actions */
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          openFinancialEditor(user)
                        }
                        disabled={isLoading}
                        className="h-10 gap-2 border-custom2 text-sm font-medium"
                      >
                        <FiEdit3
                          size={15}
                          aria-hidden="true"
                        />
                        Edit Account
                      </Button>

                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() =>
                          handleDeleteUser(user)
                        }
                        disabled={isLoading}
                        className="h-10 gap-2 border-custom3 text-sm font-medium"
                      >
                        <FiTrash2
                          size={15}
                          aria-hidden="true"
                        />
                        {isLoading
                          ? "Deleting..."
                          : "Delete User"}
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

export default UserManagement;
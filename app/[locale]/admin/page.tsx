import { redirect } from "next/navigation";

import Container from "@/components/Container";

import prisma from "@/lib/prismadb";

import { requireAdmin } from "@/actions/Admin";

const AdminPage = async () => {
  const admin = await requireAdmin();

  if (!admin) {
    redirect("/account");
  }

  const [
    totalUsers,
    pendingWithdrawals,
    approvedWithdrawals,
    rejectedWithdrawals,
    balanceResult,
    depositResult,
    profitResult,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.withdrawal.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.withdrawal.count({
      where: {
        status: "APPROVED",
      },
    }),

    prisma.withdrawal.count({
      where: {
        status: "REJECTED",
      },
    }),

    prisma.user.aggregate({
      _sum: {
        TotalBalance: true,
      },
    }),

    prisma.user.aggregate({
      _sum: {
        Deposit: true,
      },
    }),

    prisma.user.aggregate({
      _sum: {
        Profit: true,
      },
    }),
  ]);

  const totalBalance = balanceResult._sum.TotalBalance ?? 0;
  const totalDeposits = depositResult._sum.Deposit ?? 0;
  const totalProfit = profitResult._sum.Profit ?? 0;

  return (
    <Container>
      <main className="py-7 sm:py-9 lg:py-10">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-medium text-primary">
            Administration
          </p>

          <h1 className="mt-1.5 text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl">
            Admin Dashboard
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage users, accounts, balances, and withdrawal requests.
          </p>
        </div>

        {/* Withdrawal Overview */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-xl border-custom2 bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Total Users
            </p>

            <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              {totalUsers}
            </p>
          </div>

          <div className="rounded-xl border-custom2 bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Pending Withdrawals
            </p>

            <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              {pendingWithdrawals}
            </p>
          </div>

          <div className="rounded-xl border-custom2 bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Approved Withdrawals
            </p>

            <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              {approvedWithdrawals}
            </p>
          </div>

          <div className="rounded-xl border-custom2 bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Rejected Withdrawals
            </p>

            <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              {rejectedWithdrawals}
            </p>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border-custom2 bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Total Balance
            </p>

            <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              ${totalBalance.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl border-custom2 bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Total Deposits
            </p>

            <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              ${totalDeposits.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl border-custom2 bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Total Profit
            </p>

            <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              ${totalProfit.toLocaleString()}
            </p>
          </div>
        </div>
      </main>
    </Container>
  );
};

export default AdminPage;
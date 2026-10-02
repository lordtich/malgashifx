import { redirect } from "next/navigation";

import { requireAdmin } from "@/actions/Admin";

import Container from "@/components/Container";

import prisma from "@/lib/prismadb";

import WithdrawalManagement from "./WithdrawalManagement";

const WithdrawalsPage = async () => {
  const admin = await requireAdmin();

  if (!admin) {
    redirect("/account");
  }

  const withdrawals = await prisma.withdrawal.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      amount: true,

      // New withdrawal fields
      method: true,
      provider: true,
      destination: true,
      network: true,

      // Kept for older withdrawals
      phoneNumber: true,

      status: true,
      createdAt: true,

      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const serializedWithdrawals = withdrawals.map(
    (withdrawal) => ({
      ...withdrawal,
      createdAt: withdrawal.createdAt.toISOString(),
    }),
  );

  return (
    <Container>
      <main className="py-7 sm:py-9 lg:py-10">
        <WithdrawalManagement
          withdrawals={serializedWithdrawals}
        />
      </main>
    </Container>
  );
};

export default WithdrawalsPage;
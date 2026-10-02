import { redirect } from "next/navigation";

import { requireAdmin } from "@/actions/Admin";

import Container from "@/components/Container";

import prisma from "@/lib/prismadb";

import UserManagement from "./UserManagement";

const UsersPage = async () => {
  const admin = await requireAdmin();

  if (!admin) {
    redirect("/account");
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      TotalBalance: true,
      Deposit: true,
      Profit: true,
      tradingstatus: true,
      clearancestatus: true,
      role: true,
      createdAt: true,
    },
  });

  const serializedUsers = users.map((user) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
  }));

  return (
    <Container>
      <main className="py-7 sm:py-9 lg:py-10">
        <UserManagement users={serializedUsers} />
      </main>
    </Container>
  );
};

export default UsersPage;
"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/lib/prismadb";

const MIN_WITHDRAWAL = 5;
const MAX_WITHDRAWAL = 2000;

export type WithdrawalMethod =
  | "MOBILE_MONEY"
  | "CRYPTO"
  | "CARD"
  | "LOCAL_WALLET";

interface WithdrawInput {
  amount: number;
  method: WithdrawalMethod;
  provider: string;
  destination: string;
  network?: string;
}

interface WithdrawSuccess {
  success: true;
  message: string;
  balance: number;
  withdrawalId: string;
  amount: number;
  method: WithdrawalMethod;
  provider: string;
  destination: string;
  network: string | null;
}

interface WithdrawFailure {
  success: false;
  message: string;
}

type WithdrawResult = WithdrawSuccess | WithdrawFailure;

export async function withdraw({
  amount,
  method,
  provider,
  destination,
  network,
}: WithdrawInput): Promise<WithdrawResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return {
        success: false,
        message: "You must be signed in to make a withdrawal.",
      };
    }

    if (!Number.isInteger(amount)) {
      return {
        success: false,
        message: "Withdrawal amount must be a whole number.",
      };
    }

    if (amount < MIN_WITHDRAWAL) {
      return {
        success: false,
        message: `Minimum withdrawal is $${MIN_WITHDRAWAL}.`,
      };
    }

    if (amount > MAX_WITHDRAWAL) {
      return {
        success: false,
        message: `Maximum withdrawal is $${MAX_WITHDRAWAL}.`,
      };
    }

    if (!method) {
      return {
        success: false,
        message: "Please select a withdrawal method.",
      };
    }

    if (!provider.trim()) {
      return {
        success: false,
        message: "Please select a withdrawal provider.",
      };
    }

    if (!destination.trim()) {
      return {
        success: false,
        message: "Please enter your withdrawal destination.",
      };
    }

    const normalizedDestination = destination.trim();
    const normalizedProvider = provider.trim();
    const normalizedNetwork = network?.trim() || null;

    if (method === "CRYPTO" && !normalizedNetwork) {
      return {
        success: false,
        message: "Please select a cryptocurrency network.",
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        TotalBalance: true,
        clearancestatus: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Account not found.",
      };
    }

    if (!user.clearancestatus) {
      return {
        success: false,
        message:
          "Your account is not cleared for withdrawals at this time.",
      };
    }

    const currentBalance = user.TotalBalance ?? 0;

    if (currentBalance <= 0) {
      return {
        success: false,
        message: "You do not have an available balance.",
      };
    }

    if (amount > currentBalance) {
      return {
        success: false,
        message: "Withdrawal amount exceeds your available balance.",
      };
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          TotalBalance: {
            decrement: amount,
          },
        },
        select: {
          TotalBalance: true,
        },
      });

      const withdrawal = await tx.withdrawal.create({
        data: {
          userId: user.id,
          amount,
          method,
          provider: normalizedProvider,
          destination: normalizedDestination,
          network: normalizedNetwork,

          // Keep this populated for mobile-money withdrawals
          // so existing parts of the application remain compatible.
          phoneNumber:
            method === "MOBILE_MONEY"
              ? normalizedDestination
              : null,

          status: "PENDING",
        },
      });

      return {
        balance: updatedUser.TotalBalance ?? 0,
        withdrawalId: withdrawal.id,
      };
    });

    return {
      success: true,
      message: "Withdrawal submitted successfully.",
      balance: result.balance,
      withdrawalId: result.withdrawalId,
      amount,
      method,
      provider: normalizedProvider,
      destination: normalizedDestination,
      network: normalizedNetwork,
    };
  } catch (error) {
    console.error("WITHDRAWAL_ERROR", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
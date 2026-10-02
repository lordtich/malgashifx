import { getTranslations } from "next-intl/server";

import { FiArrowRight } from "react-icons/fi";

import prisma from "@/lib/prismadb";

import Container from "@/components/Container";

import { Link } from "@/i18n/navigation";

import ResendVerificationForm from "./ResendVerificationForm";

type VerifyEmailPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

const VerifyEmailPage = async ({
  searchParams,
}: VerifyEmailPageProps) => {
  const { token } = await searchParams;

  const t = await getTranslations("VerifyEmail");

  let message = t("checkEmail");
  let showSignIn = false;

  if (token) {
    try {
      const verificationToken =
        await prisma.emailVerificationToken.findUnique({
          where: {
            token,
          },
          include: {
            user: true,
          },
        });

      if (!verificationToken) {
        message = t("invalidLink");
      } else if (verificationToken.expiresAt < new Date()) {
        await prisma.emailVerificationToken.delete({
          where: {
            id: verificationToken.id,
          },
        });

        message = t("invalidLink");
      } else if (verificationToken.user.emailVerified) {
        await prisma.emailVerificationToken.delete({
          where: {
            id: verificationToken.id,
          },
        });

        message = t("alreadyVerified");
        showSignIn = true;
      } else {
        await prisma.user.update({
          where: {
            id: verificationToken.userId,
          },
          data: {
            emailVerified: new Date(),
          },
        });

        await prisma.emailVerificationToken.delete({
          where: {
            id: verificationToken.id,
          },
        });

        message = t("success");
        showSignIn = true;
      }
    } catch (error) {
      console.error("VERIFY_EMAIL_ERROR", error);
      message = t("somethingWentWrong");
    }
  }

  return (
    <Container>
      <div className="flex w-full justify-center py-8 sm:py-10">
        <div className="w-full max-w-[400px] rounded-xl border-custom2 bg-card p-6 sm:p-7">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold leading-tight tracking-tight text-secondary-foreground">
              {t("title")}
            </h1>

            <p className="text-sm leading-6 text-muted-foreground">
              {message}
            </p>
          </div>

          <div className="mt-6">
            <ResendVerificationForm />
          </div>

          {showSignIn && (
            <Link
              href="/sign-in"
              className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium text-primary transition-colors hover:bg-muted"
            >
              <span>{t("signIn")}</span>
              <FiArrowRight
                size={15}
                aria-hidden="true"
              />
            </Link>
          )}
        </div>
      </div>
    </Container>
  );
};

export default VerifyEmailPage;
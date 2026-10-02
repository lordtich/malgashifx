import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

import { getCurrentUser } from "@/actions/GetUser";

import Container from "@/components/Container";
import FormWrapper from "@/components/FormWrapper";

import RegisterForm from "./RegisterForm";

type SignUpPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const SignUpPage = async ({ params }: SignUpPageProps) => {
  const { locale } = await params;

  const currentUser = await getCurrentUser();
  const t = await getTranslations("SignUp");

  if (currentUser) {
    redirect({
      href: "/account",
      locale,
    });
  }

  return (
    <Container>
      <div className="flex w-full justify-center py-8 sm:py-10">
        <div className="w-full max-w-[400px] rounded-xl border-custom2 bg-card p-6 sm:p-7">
          <div className="mb-6 space-y-1">
            <h1 className="text-lg font-semibold leading-tight tracking-tight text-secondary-foreground">
              {t("title")}
            </h1>

            <p className="text-sm leading-6 text-muted-foreground">
              {t("description")}
            </p>
          </div>

          <FormWrapper>
            <RegisterForm />
          </FormWrapper>
        </div>
      </div>
    </Container>
  );
};

export default SignUpPage;

"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

import { useForm, type SubmitHandler } from "react-hook-form";

import toast from "react-hot-toast";
import axios from "axios";

import Input from "@/components/inputs/Input";

import { Button } from "@/components/ui/button";

import { Link } from "@/i18n/navigation";

type FormData = {
  email: string;
};

const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const t = useTranslations("ForgotPassword");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);

    const email = data.email.toLowerCase().trim();

    try {
      await axios.post("/api/forgot-password", {
        email,
      });

      toast.success(t("success"));
      router.push("/sign-in");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        toast.error(message || t("somethingWentWrong"));
      } else {
        toast.error(t("somethingWentWrong"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        id="email"
        label={t("email")}
        type="email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <Button
        type="button"
        onClick={handleSubmit(onSubmit)}
        disabled={isLoading}
        className="h-10 w-full border-custom text-sm font-medium"
      >
        {isLoading ? t("sending") : t("sendResetLink")}
      </Button>

      <p className="-mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
        {t("rememberPassword")}
        <Link
          href="/sign-in"
          className="ml-1 font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
        >
          {t("signIn")}
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;


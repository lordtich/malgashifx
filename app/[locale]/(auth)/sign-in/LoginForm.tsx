"use client";

import { useState } from "react";
import { z } from "zod";

import {
  useForm,
  type FieldErrors,
  type SubmitHandler,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import toast from "react-hot-toast";

import { FcGoogle } from "react-icons/fc";

import { createLoginSchema } from "@/lib/loginSchema";

import Input from "@/components/inputs/Input";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const t = useTranslations("SignIn");

  const loginSchema = createLoginSchema({
    invalidEmail: t("validation.invalidEmail"),
    passwordRequired: t("validation.passwordRequired"),
  });

  type FormData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onInvalid = (formErrors: FieldErrors<FormData>) => {
    const firstError = Object.values(formErrors)[0];

    if (firstError?.message) {
      toast.error(String(firstError.message));
    }

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);

    try {
      const callback = await signIn("credentials", {
        email: data.email.trim().toLowerCase(),
        password: data.password,
        redirect: false,
      });

      if (callback?.ok) {
        toast.success(t("welcomeBack"));
        router.push("/account");
        router.refresh();
        return;
      }

      if (callback?.error) {
        toast.error(callback.error);
      }
    } catch {
      toast.error(t("somethingWentWrong"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      await signIn("google", {
        callbackUrl: "/account",
      });
    } catch {
      toast.error(t("somethingWentWrong"));
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="h-10 w-full border-border text-sm font-medium"
      >
        <FcGoogle size={18} aria-hidden="true" />
        {t("continueWithGoogle")}
      </Button>

      <div className="flex flex-col gap-3">
        <Input
          id="email"
          label={t("email")}
          type="email"
          disabled={isLoading}
          register={register}
          errors={errors}
        />

        <Input
          id="password"
          label={t("password")}
          type="password"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>

      <div className="-mt-1 flex justify-end">
        <Link
          href="/forgot-password"
          className="text-xs font-medium text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground sm:text-sm"
        >
          {t("forgotPassword")}
        </Link>
      </div>

      <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
        {t("noAccount")}
        <Link
          href="/sign-up"
          className="ml-1 font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
        >
          {t("signUp")}
        </Link>
      </p>

      <Button
        type="button"
        onClick={handleSubmit(onSubmit, onInvalid)}
        disabled={isLoading}
        className="h-10 w-full border-custom text-sm font-medium"
      >
        {isLoading ? t("signingIn") : t("signIn")}
      </Button>
    </div>
  );
};

export default LoginForm;

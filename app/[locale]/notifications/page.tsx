import { useTranslations } from "next-intl";

import { IoNotificationsOutline } from "react-icons/io5";
import { FaArrowRightLong } from "react-icons/fa6";

import { Link } from "@/i18n/navigation";

const NotificationsPage = () => {
  const t = useTranslations("Notifications");

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-10 sm:py-12">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-custom2 bg-background">
          <IoNotificationsOutline
            size={30}
            className="text-primary"
            aria-hidden="true"
          />

          <span
            className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary"
            aria-hidden="true"
          />
        </div>

        <span className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-primary">
          {t("label")}
        </span>

        <h1 className="mt-1.5 text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl">
          {t("title")}
        </h1>

        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          {t("description")}
        </p>

        <Link
          href="/account"
          className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-primary transition-colors hover:text-primary/80 sm:text-sm"
        >
          {t("accountLink")}

          <FaArrowRightLong
            size={14}
            aria-hidden="true"
          />
        </Link>
      </div>
    </main>
  );
};

export default NotificationsPage;

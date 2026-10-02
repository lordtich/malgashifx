import Image from "next/image";
import { useTranslations } from "next-intl";
import { FaTelegramPlane } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

import { Link } from "@/i18n/navigation";


import Container from "../Container";
import { siteConfig } from "@/config/config";

const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <footer className="w-full border-t border-border bg-background">
      <Container>
        <div className="py-8 sm:py-10">
          {/* Main Footer */}
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr] md:gap-10">
            {/* Brand */}
            <div className="max-w-md">
              <Link
                href="/"
                className="inline-flex items-center"
                aria-label={t("homeAriaLabel")}
              >
                <div className="relative w-[145px] sm:w-[160px]">
                  <Image
                    src={siteConfig.logo}
                    alt={t("logoAlt")}
                    width={1200}
                    height={300}
                    className="h-auto w-full"
                  />
                </div>
              </Link>

              <p className="mt-3 max-w-sm text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
                {t("description")}
              </p>

              <p className="mt-3 text-xs font-medium text-secondary-foreground sm:text-sm">
                {t("tagline")}
              </p>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-xs font-semibold text-foreground sm:text-sm">
                {t("company")}
              </h3>

              <div className="mt-3 flex flex-col gap-2.5">
                <Link
                  href="/terms"
                  className="w-fit text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
                >
                  {t("terms")}
                </Link>

                <Link
                  href="/terms#privacy"
                  className="w-fit text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
                >
                  {t("privacy")}
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xs font-semibold text-foreground sm:text-sm">
                {t("contact")}
              </h3>

              <p className="mt-3 max-w-xs text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
                {t("contactDescription")}
              </p>

              <a
                href="https://t.me/malgashiadmin"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted sm:text-sm"
              >
                <FaTelegramPlane
                  className="text-primary"
                  size={15}
                  aria-hidden="true"
                />

                {t("telegramSupport")}

                <FiArrowUpRight
                  size={14}
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="my-6 h-px w-full bg-border sm:my-7" />

          {/* Bottom */}
          <div className="flex flex-col gap-2.5 text-[11px] leading-5 text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-xs">
            <span>
              &copy; {new Date().getFullYear()} {t("copyright")}
            </span>

            <span className="max-w-xl sm:text-right">
              {t("riskNotice")}
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
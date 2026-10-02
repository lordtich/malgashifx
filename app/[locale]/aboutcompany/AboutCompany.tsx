"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FaArrowDownLong } from "react-icons/fa6";

import Container from "@/components/Container";
import { buttonVariants } from "@/components/ui/button";

const AboutCompany = () => {
  const t = useTranslations("AboutCompany");

  return (
    <Container>
      <main className="py-8 sm:py-10 md:py-14 lg:py-16">
        {/* About */}
        <section className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-12 lg:gap-16">
          <div className="flex w-full max-w-[500px] flex-col items-start gap-4">
            <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {t("about.label")}
            </h1>

            <p className="text-sm leading-6 text-muted-foreground">
              {t("about.description")}
            </p>

            <Link
              href="#ceo"
              className={buttonVariants({
                variant: "link",
                className:
                  "h-auto gap-2 px-0 text-xs font-medium sm:text-sm",
              })}
            >
              <FaArrowDownLong
                size={15}
                className="text-primary"
                aria-hidden="true"
              />

              {t("about.learnMore")}
            </Link>
          </div>

          <div className="flex w-full justify-center md:justify-end">
            <div className="relative aspect-square w-full max-w-[360px] overflow-hidden rounded-xl border-custom2">
              <Image
                src="/assets/about-us.png"
                alt={t("about.imageAlt")}
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        </section>

        {/* CEO Message */}
        <section
          id="ceo"
          className="scroll-mt-24 py-12 sm:py-14 md:py-16"
        >
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-12 lg:gap-16">
            <div className="relative aspect-square w-full max-w-[360px] overflow-hidden rounded-xl border-custom2">
              <Image
                src="/assets/marktebo.png"
                alt={t("leadership.imageAlt")}
                fill
                className="object-cover object-center"
                loading="lazy"
              />
            </div>

            <div className="w-full max-w-[500px]">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-primary sm:text-xs">
                {t("leadership.label")}
              </span>

              <h2 className="mt-1.5 text-xl font-semibold leading-tight tracking-tight text-secondary-foreground sm:text-2xl">
                {t("leadership.title")}
              </h2>

              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {t("leadership.message")}
              </p>

              <div className="mt-5">
                <span className="block text-sm font-semibold text-secondary-foreground">
                  {t("leadership.name")}
                </span>

                <span className="mt-0.5 block text-xs text-muted-foreground sm:text-sm">
                  {t("leadership.role")}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Container>
  );
};

export default AboutCompany;
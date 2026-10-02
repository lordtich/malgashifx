"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { IoCheckmarkDone } from "react-icons/io5";
import { TiPlus } from "react-icons/ti";
import { FaArrowRight } from "react-icons/fa6";
import { SlPeople } from "react-icons/sl";
import { MdOutlinePaid, MdOutlineCloudDone, MdAvTimer } from "react-icons/md";
import Container from "../../Container";
import { SectionHeading } from "../../SectionHeading";
import { AboutItem } from "../aboutsection/AboutItem";
import { Button } from "@/components/ui/button";
import Couresel from "./Couresel";
import CurrencyMarkets from "../currencypairs/CurrencyMarkets";

const Hero = () => {
  const t = useTranslations("Home");

  return (
    <div>
      <Container>
        {/* Hero */}
        <section className="py-8 sm:py-10 md:py-14 lg:py-16">
          <div className="relative z-10">
            <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-12 lg:gap-16">
              {/* Left */}
              <div className="flex w-full flex-col items-start text-left md:w-1/2">
                <div className="space-y-4 sm:space-y-5">
                  {/* Badge */}
                  <div className="flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5">
                    <TiPlus className="text-primary" size={14} />

                    <span className="text-[11px] font-semibold uppercase tracking-wide text-primary sm:text-xs">
                      {t("hero.badge")}
                    </span>
                  </div>

                  {/* Heading */}
                  <h1 className="max-w-[620px] text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl md:text-4xl lg:text-5xl">
                    {t("hero.titleLine1")}
                    <br />

                    <span className="text-foreground">
                      {t("hero.titleLine2")}{" "}
                    </span>

                    <span className="text-primary">
                      {t("hero.titleHighlight")}
                    </span>
                  </h1>
                </div>

                {/* Description */}
                <p className="mt-5 max-w-[540px] text-sm leading-6 text-muted-foreground sm:mt-6 sm:leading-7">
                  {t("hero.description")}
                </p>

                {/* CTA */}
                <div className="mt-6 w-full max-w-[300px]">
                  <Button
                    asChild
                    className="h-11 w-full gap-2 border-custom text-sm font-semibold"
                  >
                    <Link href="/account">
                      {t("hero.cta")}
                      <FaArrowRight size={14} />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Image */}
              <div className="flex w-full justify-center md:w-1/2 md:justify-end">
                <div className="relative w-[220px] sm:w-[260px] md:w-full md:max-w-[380px] lg:max-w-[420px]">
                  <Image
                    src="/assets/hero.png"
                    width={1024}
                    height={1536}
                    alt={t("hero.imageAlt")}
                    priority
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-10 grid w-full grid-cols-2 overflow-hidden rounded-2xl border-custom2 bg-background sm:mt-12 md:grid-cols-4">
              {/* Investors */}
              <div className="flex min-w-0 flex-col items-center justify-center px-3 py-5 text-center sm:px-4 sm:py-6">
                <SlPeople size={21} className="text-primary" />

                <span className="mt-2 text-sm font-semibold text-foreground sm:text-base">
                  100+
                </span>

                <span className="mt-1 text-[11px] font-medium text-muted-foreground sm:text-xs">
                  {t("stats.investors")}
                </span>
              </div>

              <div className="hidden h-14 w-px self-center bg-border md:block" />

              {/* Paid Out */}
              <div className="flex min-w-0 flex-col items-center justify-center border-t border-border px-3 py-5 text-center sm:px-4 sm:py-6 md:border-t-0">
                <MdOutlinePaid size={21} className="text-primary" />

                <span className="mt-2 text-sm font-semibold text-foreground sm:text-base">
                  $50,000+
                </span>

                <span className="mt-1 text-[11px] font-medium text-muted-foreground sm:text-xs">
                  {t("stats.paidOut")}
                </span>
              </div>

              <div className="hidden h-14 w-px self-center bg-border md:block" />

              {/* Success Rate */}
              <div className="flex min-w-0 flex-col items-center justify-center border-t border-border px-3 py-5 text-center sm:px-4 sm:py-6 md:border-t-0">
                <MdOutlineCloudDone size={21} className="text-primary" />

                <span className="mt-2 text-sm font-semibold text-foreground sm:text-base">
                  98%
                </span>

                <span className="mt-1 text-[11px] font-medium text-muted-foreground sm:text-xs">
                  {t("stats.successRate")}
                </span>
              </div>

              <div className="hidden h-14 w-px self-center bg-border md:block" />

              {/* Support */}
              <div className="flex min-w-0 flex-col items-center justify-center border-t border-border px-3 py-5 text-center sm:px-4 sm:py-6 md:border-t-0">
                <MdAvTimer size={21} className="text-primary" />

                <span className="mt-2 text-sm font-semibold text-foreground sm:text-base">
                  24/7
                </span>

                <span className="mt-1 text-[11px] font-medium text-muted-foreground sm:text-xs">
                  {t("stats.customerSupport")}
                </span>
              </div>
            </div>

            {/* Carousel */}
            <div className="mt-10 sm:mt-12 md:mt-14">
              <Couresel />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-10 sm:py-12 md:py-14">
          <div className="flex flex-col gap-5">
            <div>
              <Button
                variant="outline"
                className="h-8 border-custom px-3.5 text-[11px] font-semibold sm:text-xs"
              >
                {t("about.label")}
              </Button>
            </div>

            <SectionHeading title={t("about.title")} />
          </div>

          <div className="mt-7 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="w-full max-w-[520px] text-sm leading-6 text-muted-foreground sm:leading-7">
              <p>{t("about.description")}</p>
            </div>

            <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4 lg:max-w-[650px]">
              <AboutItem title="150" subtitle={t("about.tradingProducts")} />

              <AboutItem
                title="$0.00"
                subtitle={t("about.accountMaintenanceFees")}
              />

              <AboutItem title="1:200" subtitle={t("about.leverage")} />

              <AboutItem title="MT4" subtitle={t("about.tradingPlatform")} />
            </div>
          </div>
        </section>

        {/* Currency Pairs */}
        <CurrencyMarkets />

        {/* Account Opening */}
        <section className="py-10 sm:py-12 md:py-14">
          <div className="flex flex-col gap-5">
            <div>
              <Button
                variant="outline"
                className="h-8 border-custom px-3.5 text-[11px] font-semibold sm:text-xs"
              >
                {t("accountOpening.label")}
              </Button>
            </div>

            <SectionHeading title={t("accountOpening.title")} />
          </div>

          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-14">
            {/* Text */}
            <div className="w-full max-w-[600px]">
              <p className="text-sm leading-6 text-muted-foreground sm:leading-7">
                {t("accountOpening.description")}
              </p>

              <div className="mt-6 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <IoCheckmarkDone
                    size={21}
                    className="mt-0.5 shrink-0 text-primary"
                  />

                  <span className="text-sm leading-6 text-secondary-foreground">
                    {t("accountOpening.stepOne")}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <IoCheckmarkDone
                    size={21}
                    className="mt-0.5 shrink-0 text-primary"
                  />

                  <span className="text-sm leading-6 text-secondary-foreground">
                    {t("accountOpening.stepTwo")}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <IoCheckmarkDone
                    size={21}
                    className="mt-0.5 shrink-0 text-primary"
                  />

                  <span className="text-sm leading-6 text-secondary-foreground">
                    {t("accountOpening.stepThree")}
                  </span>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="flex w-full justify-center lg:w-1/2 lg:justify-end">
              <div className="relative aspect-square w-full max-w-[340px]">
                <Image
                  src="/assets/createacc.png"
                  alt={t("accountOpening.imageAlt")}
                  fill
                  className="object-contain object-center"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="pb-8 pt-6 sm:pb-10">
          <div className="mx-auto flex w-full max-w-[900px] flex-col items-center gap-7 rounded-2xl border-custom2 bg-background px-5 py-7 sm:px-8 sm:py-9 md:flex-row md:justify-between md:gap-10 md:px-10">
            {/* Image */}
            <div className="relative hidden aspect-square w-full max-w-[210px] shrink-0 md:block">
              <Image
                src="/assets/ready.png"
                alt={t("finalCta.imageAlt")}
                fill
                className="object-contain"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="w-full">
              <Button
                variant="outline"
                className="h-8 border-custom px-3.5 text-[11px] font-semibold sm:text-xs"
              >
                {t("finalCta.label")}
              </Button>

              <h2 className="mt-3 text-lg font-semibold tracking-tight text-secondary-foreground sm:text-xl">
                {t("finalCta.title")}
              </h2>

              <p className="mt-2 max-w-[500px] text-sm leading-6 text-muted-foreground">
                {t("finalCta.description")}
              </p>

              <div className="mt-5">
                <Button
                  asChild
                  className="h-11 w-full border-custom text-sm font-semibold sm:w-[210px]"
                >
                  <Link href="/account">{t("finalCta.button")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
};

export default Hero;

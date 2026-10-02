"use client";

import { useTranslations } from "next-intl";

import FaqItem from "./FaqItem";

interface Faq {
  title: string;
  description: string;
}

const Faqs = () => {
  const t = useTranslations("Faqs");

  const faqData: Faq[] = [
    {
      title: t("items.whatIsInvesting.title"),
      description: t("items.whatIsInvesting.description"),
    },
    {
      title: t("items.investmentTypes.title"),
      description: t("items.investmentTypes.description"),
    },
    {
      title: t("items.howToStart.title"),
      description: t("items.howToStart.description"),
    },
  ];

  return (
    <>
      <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        {t("title")}
      </h2>

      <div className="mt-5 flex flex-col gap-3">
        {faqData.map((item) => (
          <FaqItem data={item} key={item.title} />
        ))}
      </div>
    </>
  );
};

export default Faqs;
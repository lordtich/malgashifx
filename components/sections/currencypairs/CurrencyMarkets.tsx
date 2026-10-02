"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import { SectionHeading } from "../../SectionHeading";
import CurrencyItem from "./CurrencyItem";
import { currencyPairs } from "./marketData";
import { useForexMarket } from "./useForexMarket";

const CurrencyMarkets = () => {
  const t = useTranslations("Home");

  const { data, loading, error } = useForexMarket();

  return (
    <section className="py-10 sm:py-12 md:py-14">
      <div className="flex flex-col gap-5">
        <div>
          <Button
            variant="outline"
            className="h-8 border-custom px-3.5 text-[11px] font-semibold sm:text-xs"
          >
            {t("markets.label")}
          </Button>
        </div>

        <SectionHeading title={t("markets.title")} />
      </div>

      <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {currencyPairs.map((pair) => {
          const market = data.find(
            (item) => item.symbol === pair.symbol
          );

          if (loading) {
            return (
              <div
                key={pair.symbol}
                className="h-[190px] w-full animate-pulse rounded-xl border-custom2"
              />
            );
          }

          if (!market) {
            return (
              <div
                key={pair.symbol}
                className="flex h-[190px] items-center justify-center rounded-xl border-custom2 p-4 text-sm text-muted-foreground"
              >
                {error ?? "Market data unavailable"}
              </div>
            );
          }

          return (
            <CurrencyItem
              key={pair.symbol}
              image={pair.image}
              title={pair.title}
              price={market.price}
              change={market.change}
              prices={market.prices}
            />
          );
        })}
      </div>
    </section>
  );
};

export default CurrencyMarkets;

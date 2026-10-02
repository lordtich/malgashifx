"use client";

import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import axios from "axios";
import { TruncateText } from "../../TruncateText";

interface Exchange {
  id: string;
  name: string;
  trade_volume_24h_btc: number | null;
}

interface ValidExchange {
  id: string;
  name: string;
  volume: number;
}

const Couresel = () => {
  const [exchanges, setExchanges] = useState<ValidExchange[]>([]);

  const autoplay = useRef(
    Autoplay({
      delay: 2500,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: true,
    },
    [autoplay.current]
  );

  useEffect(() => {
    let mounted = true;

    const fetchExchanges = async () => {
      try {
        const response = await axios.get<Exchange[]>(
          "https://api.coingecko.com/api/v3/exchanges"
        );

        if (!mounted) return;

        const validExchanges = response.data
          .filter(
            (
              exchange
            ): exchange is Exchange & {
              trade_volume_24h_btc: number;
            } =>
              Boolean(exchange.name) &&
              typeof exchange.trade_volume_24h_btc === "number"
          )
          .map((exchange) => ({
            id: exchange.id,
            name: exchange.name,
            volume: exchange.trade_volume_24h_btc,
          }));

        setExchanges(validExchanges);
      } catch {
        if (mounted) {
          setExchanges([]);
        }
      }
    };

    fetchExchanges();

    return () => {
      mounted = false;
    };
  }, []);

  if (!exchanges.length) {
    return null;
  }

  return (
    <div
      ref={emblaRef}
      aria-label="Exchange market volumes"
      className="overflow-hidden rounded-xl border border-border bg-background"
    >
      <div className="flex">
        {exchanges.map((exchange) => (
          <div
            key={exchange.id}
            className="min-w-0 shrink-0 basis-auto"
          >
            <div className="flex items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3">
              <span className="text-[11px] font-medium text-muted-foreground sm:text-xs">
                {TruncateText(exchange.name)}
              </span>

              <span className="h-1 w-1 shrink-0 rounded-full bg-primary/20" />

              <span className="text-[11px] font-semibold text-primary sm:text-xs">
                {exchange.volume.toFixed(2)} BTC
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Couresel;
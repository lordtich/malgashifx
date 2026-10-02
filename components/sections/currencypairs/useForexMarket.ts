"use client";

import { useCallback, useEffect, useState } from "react";

export interface ForexMarket {
  symbol: string;
  price: number;
  change: number;
  prices: number[];
}

interface ForexResponse {
  data: ForexMarket[];
}

export const useForexMarket = () => {
  const [data, setData] = useState<ForexMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = useCallback(async () => {
    try {
      setError(null);

      const response = await fetch("/api/forex", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch forex data");
      }

      const result: ForexResponse = await response.json();

      setData(result.data);
    } catch (error) {
      console.error("Forex market error:", error);
      setError("Unable to load market data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();

    const interval = setInterval(fetchMarketData, 60_000);

    return () => clearInterval(interval);
  }, [fetchMarketData]);

  return {
    data,
    loading,
    error,
  };
};

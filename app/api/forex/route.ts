import { NextResponse } from "next/server";

const API_KEY = process.env.TWELVE_DATA_API_KEY;

const SYMBOLS = ["EUR/USD", "EUR/CAD", "EUR/JPY"];

const INTERVAL = "5min";
const OUTPUT_SIZE = "289";

export async function GET() {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "Twelve Data API key is not configured" },
      { status: 500 }
    );
  }

  try {
    const results = await Promise.all(
      SYMBOLS.map(async (symbol) => {
        const url = new URL(
          "https://api.twelvedata.com/time_series"
        );

        url.searchParams.set("symbol", symbol);
        url.searchParams.set("interval", INTERVAL);
        url.searchParams.set("outputsize", OUTPUT_SIZE);
        url.searchParams.set("apikey", API_KEY);

        const response = await fetch(url.toString(), {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch ${symbol}`);
        }

        const result = await response.json();

        if (result.status === "error") {
          throw new Error(
            result.message || `Failed to fetch ${symbol}`
          );
        }

        const values = result.values ?? [];

        const prices = values
          .map((item: { close: string }) => Number(item.close))
          .filter((price: number) => Number.isFinite(price))
          .reverse();

        if (prices.length === 0) {
          throw new Error(`No market data available for ${symbol}`);
        }

        const latestPrice = prices[prices.length - 1];

        const price24HoursAgo =
          prices.length > 288
            ? prices[prices.length - 289]
            : prices[0];

        const change =
          price24HoursAgo === 0
            ? 0
            : ((latestPrice - price24HoursAgo) /
                price24HoursAgo) *
              100;

        return {
          symbol,
          price: latestPrice,
          change,
          prices,
        };
      })
    );

    return NextResponse.json({
      data: results,
    });
  } catch (error) {
    console.error("Forex API error:", error);

    return NextResponse.json(
      { error: "Unable to fetch forex market data" },
      { status: 500 }
    );
  }
}
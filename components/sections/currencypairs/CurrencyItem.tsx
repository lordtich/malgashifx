import Image, { StaticImageData } from "next/image";

interface CurrencyItemProps {
  image: string | StaticImageData;
  title: string;
  price: number;
  change: number;
  prices: number[];
}

const CurrencyItem = ({
  image,
  title,
  price,
  change,
  prices,
}: CurrencyItemProps) => {
  const isPositive = change >= 0;

  const width = 300;
  const height = 80;
  const padding = 4;

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1;

  const points = prices
    .map((value, index) => {
      const x =
        padding +
        (index / Math.max(prices.length - 1, 1)) *
          (width - padding * 2);

      const y =
        height -
        padding -
        ((value - minPrice) / range) *
          (height - padding * 2);

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full rounded-xl border-custom2 p-4 sm:p-5 lg:max-w-[370px]">
      {/* Pair */}
      <div className="flex items-center">
        <div className="relative mr-3 w-9 shrink-0 sm:w-11">
          <Image
            src={image}
            alt={`${title} currency pair`}
            className="h-auto w-full"
            loading="lazy"
          />
        </div>

        <span className="text-sm font-semibold capitalize text-card-foreground">
          {title}
        </span>
      </div>

      {/* Price Information */}
      <div className="mt-5 flex items-end justify-between gap-5">
        <div>
          <span className="block text-[11px] font-medium text-muted-foreground sm:text-xs">
            Buy Price
          </span>

          <span className="mt-1 block text-sm text-card-foreground">
            {price.toFixed(4)}
          </span>
        </div>

        <div className="text-right">
          <span className="block text-[11px] font-medium text-muted-foreground sm:text-xs">
            Change
          </span>

          <span
            className={`mt-1 block text-sm font-medium ${
              isPositive ? "text-primary" : "text-destructive"
            }`}
          >
            {isPositive ? "+" : ""}
            {change.toFixed(3)}%
          </span>
        </div>
      </div>

      {/* Graph */}
      <div className="mt-5 w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          preserveAspectRatio="none"
          aria-label={`${title} price movement`}
          role="img"
        >
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={
              isPositive ? "text-primary" : "text-destructive"
            }
          />
        </svg>
      </div>
    </div>
  );
};

export default CurrencyItem;

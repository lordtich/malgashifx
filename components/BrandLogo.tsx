"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { siteConfig } from "@/config/config";

const BrandLogo = () => {
  const { resolvedTheme } = useTheme();

  const logo =
    resolvedTheme === "dark"
      ? "/images/logo-dark.svg"
      : siteConfig.logo;

  return (
    <Image
      src={logo}
      alt={siteConfig.name}
      priority
      width={1200}
      height={300}
      className="h-auto w-full"
    />
  );
};

export default BrandLogo;
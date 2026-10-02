import { IoMdNotifications } from "react-icons/io";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/actions/GetUser";
import { Link } from "@/i18n/navigation";
import Container from "../Container";
import MobileMenu from "./MobileMenu";
import UserMenu from "./UserMenu";
import ThemeToggle from "../ThemeToggle";
import LanguageSwitcher from "../LanguageSwitcher";
import { buttonVariants } from "../ui/button";
import { siteConfig } from "@/config/config";
import BrandLogo from "../BrandLogo";

const Navbar = async () => {
  const currentUser = await getCurrentUser();
  const t = await getTranslations("Navbar");

  return (
    <nav className="sticky inset-x-0 top-0 z-50 w-full border-b border-border bg-background">
      <Container>
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label={`${siteConfig.name} home`}
          >
            <div className="relative w-[155px] sm:w-[175px] lg:w-[190px]">
              <BrandLogo />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
            <ul className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <li>
                <Link
                  href="/aboutcompany"
                  className="transition-colors hover:text-foreground"
                >
                  {t("aboutCompany")}
                </Link>
              </li>

              <li>
                <Link
                  href="/faqs"
                  className="transition-colors hover:text-foreground"
                >
                  {t("faqs")}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-1 text-secondary-foreground sm:gap-1.5 md:gap-2.5">
            {/* Theme */}
            <div className="hidden md:block">
              <ThemeToggle compact />
            </div>

            {/* Language */}
            <LanguageSwitcher compact />

            {/* Notifications */}
            <Link
              href="/notifications"
              aria-label={t("notifications")}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted active:scale-95"
            >
              <span className="relative flex items-center justify-center">
                <IoMdNotifications size={20} aria-hidden="true" />

                <span className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-destructive" />
              </span>
            </Link>

            {/* Desktop Authentication */}
            {!currentUser && (
              <div className="hidden items-center gap-2 md:flex">
                <Link
                  href="/sign-in"
                  className={buttonVariants({
                    variant: "outline",
                    className:
                      "h-9 border-border px-3 text-xs font-medium sm:text-sm",
                  })}
                >
                  {t("signIn")}
                </Link>

                <span className="h-4 w-px bg-border" />

                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    variant: "default",
                    className: "h-9 px-4 text-xs font-medium sm:text-sm",
                  })}
                >
                  {t("signUp")}
                </Link>
              </div>
            )}

            {/* User */}
            <UserMenu currentUser={currentUser} />

            {/* Mobile */}
            <MobileMenu currentUser={currentUser} />
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;

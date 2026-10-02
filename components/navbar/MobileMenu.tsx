"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

import { MdOutlineSupervisorAccount } from "react-icons/md";
import { MdAdminPanelSettings } from "react-icons/md";
import { GrCircleInformation } from "react-icons/gr";
import { BsPatchQuestion } from "react-icons/bs";
import { IoChevronDown } from "react-icons/io5";

import { SafeUser } from "@/types";

import MenuItem from "./MenuItem";
import { Button, buttonVariants } from "../ui/button";
import ThemeToggle from "../ThemeToggle";

interface MobileProps {
  currentUser: SafeUser | null;
}

const MobileMenu = ({ currentUser }: MobileProps) => {
  const t = useTranslations("Navbar");

  const [menuOpen, setMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setAdminOpen(false);
  };

  const toggleAdmin = () => {
    setAdminOpen((prev) => !prev);
  };

  const handleSignOut = async () => {
    closeMenu();
    await signOut();
  };

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* Mobile menu trigger */}
      <button
        type="button"
        onClick={toggleMenu}
        aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
        aria-expanded={menuOpen}
        className="relative z-[70] flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted/60 active:scale-95 lg:hidden"
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          <span
            className={`absolute h-[2px] w-5 rounded-full bg-foreground transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              menuOpen ? "rotate-45" : "-translate-y-[4px]"
            }`}
          />

          <span
            className={`absolute h-[2px] w-5 rounded-full bg-foreground transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              menuOpen ? "-rotate-45" : "translate-y-[4px]"
            }`}
          />
        </span>
      </button>

      {/* Mobile drawer */}
      <div
        className={`absolute left-1/2 top-full z-40 h-[calc(100dvh-4rem)] w-screen -translate-x-1/2 overflow-hidden lg:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label={t("closeMenu")}
          onClick={closeMenu}
          className={`absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Drawer panel */}
        <aside
          className={`absolute bottom-0 right-0 top-0 flex w-[82%] max-w-[420px] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-5">
            <div className="flex flex-col gap-1">
              {currentUser && (
                <>
                  <Link href="/account" onClick={closeMenu}>
                    <MenuItem
                      url="account"
                      onClick={closeMenu}
                      icon={MdOutlineSupervisorAccount}
                    >
                      {t("account")}
                    </MenuItem>
                  </Link>

                  {currentUser.role === "ADMIN" && (
                    <div>
                      <button
                        type="button"
                        onClick={toggleAdmin}
                        aria-expanded={adminOpen}
                        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <span className="flex items-center gap-3">
                          <MdAdminPanelSettings
                            size={20}
                            className="shrink-0"
                            aria-hidden="true"
                          />

                          <span>{t("adminPanel")}</span>
                        </span>

                        <IoChevronDown
                          size={17}
                          className={`transition-transform duration-200 ${
                            adminOpen ? "rotate-180" : ""
                          }`}
                          aria-hidden="true"
                        />
                      </button>

                      {adminOpen && (
                        <div className="ml-8 border-l border-border pl-1.5">
                          <Link href="/admin" onClick={closeMenu}>
                            <MenuItem
                              url="admin"
                              onClick={closeMenu}
                            >
                              {t("dashboard")}
                            </MenuItem>
                          </Link>

                          <Link
                            href="/admin/users"
                            onClick={closeMenu}
                          >
                            <MenuItem
                              url="admin/users"
                              onClick={closeMenu}
                            >
                              {t("users")}
                            </MenuItem>
                          </Link>

                          <Link
                            href="/admin/withdrawals"
                            onClick={closeMenu}
                          >
                            <MenuItem
                              url="admin/withdrawals"
                              onClick={closeMenu}
                            >
                              {t("withdrawals")}
                            </MenuItem>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="my-2 h-px bg-border" />
                </>
              )}

              <Link href="/aboutcompany" onClick={closeMenu}>
                <MenuItem
                  url="aboutcompany"
                  onClick={closeMenu}
                  icon={GrCircleInformation}
                >
                  {t("aboutCompany")}
                </MenuItem>
              </Link>

              <Link href="/faqs" onClick={closeMenu}>
                <MenuItem
                  url="faqs"
                  onClick={closeMenu}
                  icon={BsPatchQuestion}
                >
                  {t("faqs")}
                </MenuItem>
              </Link>

              <div className="my-2 h-px bg-border" />

              <ThemeToggle />
            </div>
          </div>

          {/* Bottom actions */}
          <div className="border-t border-border bg-background px-4 pb-5 pt-4">
            {currentUser ? (
              <Button
                type="button"
                onClick={handleSignOut}
                variant="destructive"
                className="h-11 w-full rounded-xl border-custom3 text-sm font-medium"
              >
                {t("signOut")}
              </Button>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/sign-in"
                  onClick={closeMenu}
                  className={buttonVariants({
                    variant: "outline",
                    className:
                      "h-11 w-full rounded-xl border-custom2 text-sm font-medium",
                  })}
                >
                  {t("signIn")}
                </Link>

                <Link
                  href="/sign-up"
                  onClick={closeMenu}
                  className={buttonVariants({
                    variant: "default",
                    className:
                      "h-11 w-full rounded-xl border-custom text-sm font-medium",
                  })}
                >
                  {t("signUp")}
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
};

export default MobileMenu;

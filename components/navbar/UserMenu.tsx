"use client";

import { useCallback, useState } from "react";

import { Link } from "@/i18n/navigation";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

import { IoChevronDown } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { MdAdminPanelSettings } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { MdOutlineNoAccounts } from "react-icons/md";

import { SafeUser } from "@/types";

import Avatar from "./Avatar";
import MenuItem from "./MenuItem";
import ThemeToggle from "../ThemeToggle";

interface UserMenuProps {
  currentUser: SafeUser | null;
}

const UserMenu = ({ currentUser }: UserMenuProps) => {
  const t = useTranslations("Navbar");

  const [isOpen, setIsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const toggleAdmin = useCallback(() => {
    setAdminOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setAdminOpen(false);
  }, []);

  const handleSignOut = async () => {
    closeMenu();
    await signOut();
  };

  return (
    <div className="relative">
      {/* User Trigger */}
      {currentUser && (
        <button
          type="button"
          onClick={toggleOpen}
          aria-label={t("account")}
          aria-expanded={isOpen}
          className="flex items-center gap-1 rounded-full transition-colors hover:bg-muted/60"
        >
          <Avatar src={currentUser.image} />

          <IoChevronDown
            size={17}
            className={`hidden text-muted-foreground transition-transform duration-200 md:flex ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-[52px] z-30 w-[220px] overflow-hidden rounded-xl border border-border bg-background shadow-sm">
          {currentUser ? (
            <div className="p-1.5">
              {/* Account */}
              <Link href="/account" onClick={closeMenu}>
                <MenuItem
                  url="account"
                  onClick={closeMenu}
                  icon={MdOutlineSupervisorAccount}
                >
                  {t("account")}
                </MenuItem>
              </Link>

              {/* Admin */}
              {currentUser.role === "ADMIN" && (
                <div>
                  <button
                    type="button"
                    onClick={toggleAdmin}
                    aria-expanded={adminOpen}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted hover:text-foreground sm:text-sm"
                  >
                    <span className="flex items-center gap-2.5">
                      <MdAdminPanelSettings
                        size={19}
                        className="shrink-0"
                        aria-hidden="true"
                      />

                      <span>{t("adminPanel")}</span>
                    </span>

                    <IoChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        adminOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {adminOpen && (
                    <div className="mb-1 ml-8 border-l border-border pl-1.5">
                      <Link href="/admin" onClick={closeMenu}>
                        <MenuItem url="admin" onClick={closeMenu}>
                          {t("dashboard")}
                        </MenuItem>
                      </Link>

                      <Link href="/admin/users" onClick={closeMenu}>
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

              <div className="my-1.5 h-px bg-border" />

              <ThemeToggle />

              <MenuItem
                icon={TbLogout2}
                onClick={handleSignOut}
              >
                {t("signOut")}
              </MenuItem>
            </div>
          ) : (
            <div className="p-1.5">
              <Link href="/sign-in" onClick={closeMenu}>
                <MenuItem
                  onClick={closeMenu}
                  icon={HiOutlineLogout}
                >
                  {t("signIn")}
                </MenuItem>
              </Link>

              <Link href="/sign-up" onClick={closeMenu}>
                <MenuItem
                  onClick={closeMenu}
                  icon={MdOutlineNoAccounts}
                >
                  {t("signUp")}
                </MenuItem>
              </Link>

              <div className="my-1.5 h-px bg-border" />

              <ThemeToggle />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
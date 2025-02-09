"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Sun, Moon, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Wallet from "./wallet";

const links = [
  {
    label: "COLLECTIONS",
    href: "/collections",
  },
  {
    label: "PORTFOLIO",
    href: "/portfolio",
  },
  {
    label: "ACTIVITY",
    href: "/activity",
  },
  {
    label: "AIRDROP",
    href: "/airdrop",
  },
];

export default function NavBar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="border-b border-gray-800 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex item-center space-x-8">
          {/* 图片 */}
          <div className="text-primary font-bold text-xl font-poppins">
            <img src="/logo.png" alt="RCC" width={80} height={80}></img>
          </div>
          {/*如果只写hidden 就代表隐藏  用了md:flex 就代表在md以上的屏幕显示 */}
          <div className="tx-sm space-x-6 hidden md:flex items-center">
            {links.map((link) => (
              <Link href={link.href} key={link.href}>
                <span
                  className={`hover:text-[#8e67e9] ${
                    pathname === link.href ? "text-[#8e67e9]" : ""
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
        {/* 桌面端右侧工具栏 */}
        <div className="hidden md:flex items-center space-x-8">
          {/* 这里mounted的作用是防止在服务器端渲染时，theme为undefined
              导致水合错误，因为theme在服务器端渲染时为undefined，在客户端渲染时为dark，不匹配
           */}
          {!mounted ? null : (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          )}
          <ConnectButton />
        </div>

        {/* 移动端菜单按钮 */}
        <div className="md:hidden">
          <button onClick={() => setIsOpenMenu(!isOpenMenu)}>
            {isOpenMenu ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      {/* 移动端菜单 */}
      {isOpenMenu && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[hsl(var(--background))]">
          <div>
            {links.map((link) => (
              <div
                onClick={() => setIsOpenMenu(false)}
                key={link.href}
                className="flex flex-col items-center space-y-4 border-b border-gray-800 py-5"
              >
                <Link href={link.href}>
                  <span
                    className={`hover:text-[#8e67e9] ${
                      pathname === link.href ? "text-[#8e67e9]" : ""
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              </div>
            ))}
          </div>
          <div className="flex justify-between p-4">
            {!mounted ? null : (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            )}
            <Wallet />
          </div>
        </div>
      )}
    </nav>
  );
}

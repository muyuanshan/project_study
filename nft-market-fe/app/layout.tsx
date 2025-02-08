import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next/types";
import ClientLayout  from "@/app/client-layout";

const inter = Inter({ subsets: ["latin"] }); // 字体


export const metadata: Metadata = {
  title: "MYRCC - NFT Marketplace",
  description: "Trade NFT collections",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>

    </html>
  );
}

/**
 * 注释以及一些学习笔记
 * 1. suppressHydrationWarning 是一个用于抑制客户端和服务端渲染不匹配警告的属性 防止在客户端渲染出现警告 nextjs中使用
 * 2. <body className={`${inter.className} min-h-screen`}> 是设置字体 min-h-screen
 */

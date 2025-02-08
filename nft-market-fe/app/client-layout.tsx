'use client'

import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider } from "wagmi";
import { config } from '@/config/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import NavBar from '@/components/nav-bar';


const queryClient = new QueryClient();

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
                <NavBar />
                {children}
            </RainbowKitProvider>
        </QueryClientProvider>
    </WagmiProvider>
}

/**
 * 学习笔记
 * 1. 'use client' 设置这个组件是客户端组件，用于和浏览器交互
 * 2. 
 */
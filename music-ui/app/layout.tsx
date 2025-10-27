'use client';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { AppShell, AppShellMain, createTheme, MantineProvider } from '@mantine/core';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MessageProvider } from '@/components/message';
import { ErrorMessageProvider } from '@/components/error-message';
import React from 'react';
import CredentialDrawer, { CredentialDrawerRef } from '@/components/credential-drawer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const theme = createTheme({
  /** Put your mantine theme override here */
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{
  const queryClient = new QueryClient()
  const credentialDrawerRef = React.useRef<CredentialDrawerRef>(null);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme}>
            <ErrorMessageProvider>
              <MessageProvider>
                <AppShell header={{ height: 60 }} padding="md">
                  <AppShell.Header>
                    <div className='px-12 flex text-white flex-row items-center px-8 h-full bg-[#a187ec]  text-[#343a40]'>
                      <p className='text-lg font-semibold flex-1' onClick={() => credentialDrawerRef.current?.openDrawer()}>Music Collections</p>
                      <button className='font-bold'>
                        <a className='font-bold' href='albums'>Albums</a>
                      </button>
                      <button className='ps-4'>
                        <a className='font-bold' href='music'>Music</a>
                      </button>
                    </div>
                  </AppShell.Header>
                  <AppShellMain className='flex flex-col h-full'>
                    {children}
                    <CredentialDrawer ref={credentialDrawerRef} onCredentialsUpdated={() => { }} />
                  </AppShellMain>
                </AppShell>
              </MessageProvider>
            </ErrorMessageProvider>
          </MantineProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

'use client';
import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export default function Home() {

  return (
    <AppShell
      padding='md'
      header={{ height: 60 }}
    >
      <AppShell.Header>
        <div className='flex flex-row items-center px-8 h-full bg-[#b197fc]  text-[#343a40]'>
          <p className='text-lg font-semibold flex-1'>Music Collections</p>
          <button>
            <a href='#'>Albums</a>
          </button>
          <button className='ps-4'>
            <a href='#'>Music</a>
          </button>
        </div>
      </AppShell.Header>

      <AppShell.Main className='flex flex-col'>
        <div className='flex flex-row items-center justify-center flex-1'>
          <p className='text-xl'>Welcome to Music Collection</p>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}

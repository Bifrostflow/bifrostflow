'use client';
import React from 'react';
import { HeroNav } from '@/components/ui/hero-nav';
import Hero from '@/components/ui/landing/hero';
// import NavThemeToggle from '@/components/ui/nav-theme-toggle';
export default function App() {
  return (
    <div className="scroll-smooth bg-c-background">
      {/* <div
        className="bg-c-background rounded-full h-[60px] w-[60px] fixed right-1 top-14 z-100 
      justify-center items-center flex
      shadow-xl shadow-zinc-800/30">
        <NavThemeToggle />
      </div> */}
      <HeroNav />
      <Hero />
    </div>
  );
}

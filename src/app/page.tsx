// components/HeroSection.tsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { AuroraBackground } from '@/components/ui/aurora-background';
import ColourfulText from '@/components/ui/colourful-text';
import { HeroNav } from '@/components/ui/hero-nav';
import Hero from '@/components/ui/landing/hero';
import Features from '@/components/ui/landing/features';
import { FloatingNav } from '@/components/ui/floating-navbar';
import { IconHome, IconMessage, IconUser } from '@tabler/icons-react';
import Pricing from '@/components/ui/landing/pricing';
const navItems = [
  {
    name: 'Home',
    link: '#',
    icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: 'Features',
    link: '#features',
    icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: 'Pricing',
    link: '#contact',
    icon: <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
];
export default function App() {
  return (
    <div className="scroll-smooth">
      <FloatingNav navItems={navItems} />
      <HeroNav />
      <Hero />
      <Features />
      <Pricing />
    </div>
  );
}

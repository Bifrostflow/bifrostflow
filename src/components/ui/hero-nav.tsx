'use client';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '@/components/ui/resizable-navbar';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { useState } from 'react';
import NavThemeToggle from './nav-theme-toggle';
import { Button } from './button';

export function HeroNav() {
  const navItems = [
    {
      name: 'Features',
      link: '#features',
    },
    {
      name: 'Pricing',
      link: '#pricing',
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full bg-c-primary-variant">
      <Navbar
        className="bg-gradient-to-br 
      dark:to-[#003c6a] 
      dark:from-[#000e22] 
      to-[#4fb3ff] 
      from-[#1268e1] 
       text-c-on-background">
        <NavBody>
          <NavbarLogo />
          <div className="flex items-center gap-4 flex-row justify-end">
            <NavItems items={navItems} />
            <SignedOut>
              <SignInButton
                forceRedirectUrl={'/home'}
                mode="modal"
                signUpFallbackRedirectUrl={'/home'}>
                <Button variant="outline">{'Sign In'}</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton userProfileUrl="/home/settings/profile" />
            </SignedIn>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}>
            <NavThemeToggle />
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-white">
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <SignedOut>
                <SignInButton
                  forceRedirectUrl={'/home'}
                  mode="modal"
                  signUpFallbackRedirectUrl={'/home'}>
                  <Button variant="outline">{'Sign In'}</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton userProfileUrl="/home/settings/profile" />
              </SignedIn>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      {/* Navbar */}
    </div>
  );
}

'use client';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container max-w-5xl mx-auto h-15 flex items-center justify-between py-3 px-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs transition-transform group-hover:scale-105">IW</div>
          <span className="font-bold text-base tracking-tight">Interview <span className="text-primary">with us</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/guide" className="hover:text-foreground transition-colors">How it works</Link>
          <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy</Link>
        </nav>

        <div className="flex items-center gap-2">
          {mounted && (
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          )}
          <Button size="sm" asChild>
            <Link href="/#book">Book Session</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

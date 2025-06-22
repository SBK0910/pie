'use client';

import Link from 'next/link';
import { Moon, Settings2, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export default function Header() {
    const { setTheme, theme } = useTheme();
    const router = useRouter();

    return (
        <header className="sticky top-0 z-50 w-full bg-background">
            <div className="flex h-16 items-center justify-end px-4">
                <div className="flex items-center rounded-md p-0.5 mr-auto">
                    <Link href="/" className="text-xl font-bold">PIE</Link>
                </div>
                <div className="flex items-center space-x-0.5 border rounded-md p-0.5">
                    <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() => router.push('/settings')}
                    >
                        <Settings2 className="size-4" />
                    </Button>
                    <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                        <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
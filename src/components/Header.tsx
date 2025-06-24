'use client';

import { ArrowLeft, Moon, Settings2, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { useClerk, useUser } from '@clerk/nextjs';
import { useProfiling } from './providers/profiling-provider';

export default function Header() {
    const { setTheme, theme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const { isSignedIn } = useUser();
    const { signOut } = useClerk();

    const { profiling: { stage },updateStage } = useProfiling();

    return (
        <header className="fixed top-0 z-50 w-full bg-transparent">
            {pathname === '/auth' ? (
                <div className="flex h-16 items-center justify-start px-4 mr-auto">
                    <Button variant="ghost" onClick={() => router.push('/')} className='text-sm tracking-tight cursor-pointer'>
                        <ArrowLeft className="size-5" />
                        <span>Back To Profiling</span>
                    </Button>
                </div>
            ) : (
                <div className="flex h-16 items-center justify-end px-3">
                    {stage === 'investment' && (
                        <Button variant="ghost" onClick={() => updateStage('financial')} className='text-sm tracking-tight cursor-pointer mr-auto'>
                            <ArrowLeft className="size-5" />
                            <span className='sr-only'>Back To Financial</span>
                        </Button>
                    )}
                    {stage === 'chat' && (
                        <Button variant="ghost" onClick={() => updateStage('investment')} className='text-sm tracking-tight cursor-pointer mr-auto'>
                            <ArrowLeft className="size-5" />
                            <span className='sr-only'>Back To Investment</span>
                        </Button>
                    )}
                    <div className="flex items-center space-x-0.5 border rounded-md p-0.5 bg-background">
                        <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                                if (isSignedIn) {
                                    signOut({
                                        redirectUrl: '/auth',
                                    });
                                } else {
                                    router.push('/auth');
                                }
                            }}
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
            )}
        </header>
    );
}
'use client';

import { useSignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';

export default function AuthPage() {
    const { isLoaded, signIn } = useSignIn();

    const signInWithGoogle = async () => {
        if (!isLoaded) return;
        
        try {
            // Start the OAuth flow
            await signIn?.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/auth/sso-callback',
                redirectUrlComplete: '/',
            });
        } catch (err) {
            console.error('Error during OAuth flow', err);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm text-center">
                {/* Welcome Message */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-medium">Welcome to PIE</h1>
                    <p className="text-sm text-muted-foreground">
                        Sign in with your Google account to get started with our platform
                    </p>
                </div>

                {/* Custom Google Sign In Button */}
                <div className="mt-6">
                    <Button 
                        variant="outline" 
                        className="w-full justify-center gap-2"
                        onClick={signInWithGoogle}
                        disabled={!isLoaded}
                    >
                        <Icons.google className="h-4 w-4" />
                        Continue with Google
                    </Button>
                </div>

                {/* CAPTCHA Widget */}
                <div id="clerk-captcha"></div>

                {/* Terms */}
                <p className="text-xs text-muted-foreground mt-8">
                    By continuing, you agree to our{' '}
                    <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                        Privacy Policy
                    </Link>.
                </p>
            </div>
        </div>
    );
}
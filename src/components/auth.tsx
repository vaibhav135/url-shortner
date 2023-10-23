'use client';

import { Button } from './ui/button';
import { Icons } from './icons';
import Image from 'next/image';
import React from 'react';
import scenery from 'public/svg/river-8286407.svg';
import { signIn, useSession } from 'next-auth/react';

export const Auth = ({ children }: { children: React.ReactNode }) => {
    const { status } = useSession();

    const isLoading = status === 'loading';

    return (
        <>
            <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <div className="relative hidden h-full flex-col bg-muted text-white dark:border-r lg:flex">
                    <div className="absolute inset-0" />
                    <div className="relative z-20 flex items-center text-lg font-medium w-full h-full">
                        <Image
                            src={scenery}
                            className="object-cover w-full h-full"
                            alt="auth-background-image"
                        />
                        <span className="absolute p-6 top-0 text-xl">
                            {' '}
                            Shorty URL{' '}
                        </span>
                    </div>
                </div>
                <div className="lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        {children}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            type="button"
                            disabled={isLoading}
                            onClick={() => signIn('github')}
                        >
                            {isLoading ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Icons.gitHub className="mr-2 h-4 w-4" />
                            )}{' '}
                            Github
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            disabled={isLoading}
                            onClick={() => signIn('google')}
                        >
                            {isLoading ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Icons.google className="mr-2 h-4 w-4" />
                            )}{' '}
                            Google
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

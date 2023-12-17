'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TSignIn, loginSchema } from '@/common/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';

const SignInPage = () => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<TSignIn>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit: SubmitHandler<TSignIn> = async ({ email, password }) => {
        setIsLoading(true);
        await signIn('credentials', {
            email,
            password,
            callbackUrl: '/',
        });

        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    };

    return (
        <>
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Login into your account
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email below to signin your account
                </p>
            </div>
            <div className={cn('grid gap-6')}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-2">
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="email">
                                Email
                            </Label>
                            <Input
                                id="email"
                                placeholder="Email"
                                type="email"
                                autoCapitalize="none"
                                disabled={isLoading}
                                {...register('email')}
                            />
                            {errors.email && errors.email.message}{' '}
                        </div>
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="email">
                                Password
                            </Label>
                            <Input
                                id="password"
                                placeholder="Password"
                                type="password"
                                disabled={isLoading}
                                {...register('password')}
                            />
                            <p className="errors">
                                {errors.password && errors.password.message}
                            </p>
                        </div>
                        <Button disabled={isLoading} type="submit">
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            SignIn
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default SignInPage;

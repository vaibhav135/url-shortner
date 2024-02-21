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
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';

type ErrorObjectType = {
    error: string;
    message: string;
    status: number;
};

const SignInPage = () => {
    // useState.
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    // Hooks.
    const router = useRouter();

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
            redirect: false,
        })
            .then(({ ok, error }) => {
                console.info({ ok, error });
                if (ok) {
                    router.push('/');
                } else {
                    const errorJson: ErrorObjectType = JSON.parse(
                        error
                    ) satisfies ErrorObjectType;
                    toast.error(errorJson.error);

                    if (errorJson.message) {
                        setErrorMessage(errorJson.message);
                    }
                }
            })
            .finally(() => setIsLoading(false));
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
                    {errorMessage && (
                        <Alert className="bg-red-50 text-red-600 my-2 h-1/6">
                            <AlertDescription className="row-center h-full">
                                {errorMessage}
                            </AlertDescription>
                        </Alert>
                    )}
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

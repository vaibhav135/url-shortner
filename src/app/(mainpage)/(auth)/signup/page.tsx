'use client';

import * as React from 'react';

import z from 'zod';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema as authSchema } from '@/common';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserCheck } from 'lucide-react';
import { useMutation } from '@/common/hooks';

const signUpSchema = authSchema
    .extend({
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Password do not match',
        path: ['confirmPassword'],
    });

type TSignUp = z.infer<typeof signUpSchema>;

const SignUpPage = () => {
    const { request, isLoading, isSuccess } = useMutation();

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<TSignUp>({
        resolver: zodResolver(signUpSchema),
    });

    React.useEffect(() => {
        if (isSuccess) {
            reset();
        }
    }, [isSuccess, reset]);

    const onSubmit: SubmitHandler<TSignUp> = ({ email, password }) => {
        request('api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
            }),
        });
    };

    return (
        <>
            <div className="flex flex-col space-y-2 text-center">
                {isSuccess && (
                    <Alert className="bg-teal-50 text-teal-600">
                        <UserCheck className="h-4 w-4 stroke-teal-600" />
                        <AlertDescription className="flex items-start">
                            Please proceed to sign in now
                        </AlertDescription>
                    </Alert>
                )}
                <h1 className="text-2xl font-semibold tracking-tight">
                    Create an account
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email below to create your account
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
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={isLoading}
                                {...register('email')}
                            />
                            <p className="errors">
                                {errors.email && errors.email.message}{' '}
                            </p>
                        </div>
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="password">
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
                            <Input
                                id="password"
                                placeholder="Confirm Password"
                                type="password"
                                disabled={isLoading}
                                {...register('confirmPassword')}
                            />
                            <p className="errors">
                                {errors.confirmPassword &&
                                    errors.confirmPassword.message}
                            </p>
                        </div>
                        <Button disabled={isLoading} type="submit">
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            SignUp
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default SignUpPage;

'use client';
import { ScissorsLineDashed } from 'lucide-react';
import { Button, Input } from './ui';
import { useMutation } from '@/common/hooks';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    ShortendUrlData,
    shortendUrlSchema,
} from '@/common/validation/shortendUrl';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { AlertDialog } from './alert-dialog';
import { useRouter } from 'next/navigation';

type UrlSubmitData = Omit<ShortendUrlData, 'userId'>;

const InputURL = () => {
    // Hooks.
    const [showDialog, setShowDialog] = useState(false);

    const router = useRouter();
    const { data, isLoading, request } = useMutation();
    const { data: userData, status: authStatus } = useSession();

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<UrlSubmitData>({
        resolver: zodResolver(shortendUrlSchema.omit({ userId: true })),
    });

    const onSubmit: SubmitHandler<UrlSubmitData> = async ({ url }) => {
        if (authStatus === 'unauthenticated') {
            setShowDialog(true);
            return;
        }

        request('api/shorten', {
            method: 'POST',
            body: JSON.stringify({
                url,
                userId: userData.user['id'],
            }),
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full">
            <div className="flex w-full flex-col items-center justify-center gap-2">
                <div className="flex w-full items-center justify-center  space-x-2">
                    <Input
                        type="text"
                        placeholder="Enter your long URL here.."
                        {...register('url')}
                    />
                    <Button type="submit" className="gap-2">
                        <ScissorsLineDashed /> <span> Shorten </span>
                    </Button>
                    <AlertDialog
                        title="Proceed to SingIn first?"
                        description="Sorry, please signin first to shorten the url"
                        submitText="SignIn"
                        show={showDialog}
                        onCancel={() => setShowDialog(false)}
                        onSubmit={() => {
                            router.push('/signin');
                            setShowDialog(false);
                        }}
                    />
                </div>
                <p className="errors text-sm">{errors?.url?.message}</p>
            </div>
        </form>
    );
};

export const HomePage = () => {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center  ">
            <h1> Shorty Url - The Fast and Reliable URL Shortener </h1>
            <InputURL />
        </div>
    );
};

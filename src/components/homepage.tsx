'use client';

import { useRef } from 'react';
import { CheckCircle2, Clipboard, ScissorsLineDashed } from 'lucide-react';
import { Button, Input, useToast } from './ui';
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
import { Icons } from './icons';
import Image from 'next/image';
import Mountains from '../../public/images/mountains-1412683.svg';

type UrlSubmitData = Omit<ShortendUrlData, 'userId'>;

type ShortendUrlResponse = {
    shortUrl: string;
    longUrl: string;
};

const InputURL = () => {
    // Hooks.
    const [showDialog, setShowDialog] = useState(false);

    const urlCopyRef = useRef<HTMLSpanElement>();
    const { toast } = useToast();

    const router = useRouter();
    const { data, isLoading, isSuccess, request } =
        useMutation<ShortendUrlResponse>();
    const { data: userData, status: authStatus } = useSession();

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<UrlSubmitData>({
        resolver: zodResolver(shortendUrlSchema.omit({ userId: true })),
    });

    const sanitizeUrl = (url: string) => {
        try {
            new URL(url);
        } catch (Exception) {
            return 'https://' + url;
        }
        return url;
    };

    const onSubmit: SubmitHandler<UrlSubmitData> = async ({ url }) => {
        if (authStatus === 'unauthenticated') {
            setShowDialog(true);
            return;
        }
        const sanitizedUrl = sanitizeUrl(url);

        request('api/shorten', {
            method: 'POST',
            body: JSON.stringify({
                url: sanitizedUrl,
                userId: userData.user['id'],
            }),
        });
    };

    const handleCopyUrl = async () => {
        if (urlCopyRef && urlCopyRef.current) {
            await navigator.clipboard.writeText(urlCopyRef.current.outerText);

            toast({
                title: (
                    <span className="inline-flex">
                        <CheckCircle2 className="stroke-green-400 mr-2 w-4" />
                        Url Copied Successfully
                    </span>
                ),
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full">
            <div className="flex w-full flex-col items-center justify-center gap-2">
                <div className="flex w-full items-center justify-center  space-x-2">
                    <Input
                        type="text"
                        placeholder="Enter your long URL here.."
                        className="my-5"
                        {...register('url')}
                    />
                    <Button type="submit" className="gap-2">
                        {isLoading ? (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <ScissorsLineDashed /> <span> Shorten </span>
                            </>
                        )}
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
                {data && isSuccess && (
                    <div className="flex justify-center items-center w-1/2">
                        <div className="grid grid-cols-3 gap-y-3">
                            <div className="font-bold"> Long Url </div>
                            <div className="col-span-2 line-clamp-1 bg-white text-black px-2 p-0.5 rounded-md opacity-40">
                                {data.longUrl}
                            </div>
                            <div className="font-bold"> Shorty Url</div>
                            <div className="col-span-2">
                                <span className="flex justify-center items-center gap-2 ">
                                    <span
                                        ref={urlCopyRef}
                                        className="line-clamp-1 bg-white text-black px-2 p-0.5 rounded-md opacity-40"
                                    >
                                        {data.shortUrl}
                                    </span>
                                    <Clipboard
                                        className="border-2 rounded-md bg-white opacity-40 text-black w-7 h-7 p-1 hover:stroke-gray-100 hover:bg-gray-600  hover:rounded hover:cursor-copy"
                                        onClick={handleCopyUrl}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <p className="errors text-sm">{errors?.url?.message}</p>
            </div>
        </form>
    );
};

export const HomePage = () => {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center  ">
            <Image
                src={Mountains}
                alt="homepage background"
                objectFit="cover"
                layout="fill"
                className="-z-10 opacity-80"
            />
            <div className="backdrop-blur-sm p-3">
                <h1 className="text-4xl mb-3">
                    <strong> Shorty Url </strong> - The Fast and Reliable URL
                    Shortener
                </h1>
                <InputURL />
            </div>
        </div>
    );
};

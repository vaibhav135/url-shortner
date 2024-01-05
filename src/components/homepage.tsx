'use client';

import { QrCode, ScissorsLineDashed } from 'lucide-react';
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
import { Icons } from './icons';
import Image from 'next/image';
import AbstractImage from '../../public/images/night-mountain.svg';
import QRCode from 'react-qr-code';
import CustomClipboard from './ui/clipboard';

type UrlSubmitData = Omit<ShortendUrlData, 'userId'>;

type ShortendUrlResponse = {
    shortUrl: string;
    longUrl: string;
};

const InputURL = () => {
    // Hooks.
    const [showDialog, setShowDialog] = useState(false);
    const [showQR, setShowQR] = useState(false);

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
                    <>
                        <div className="flex justify-center items-center w-4/5">
                            <div className="grid grid-cols-3 gap-y-3  mr-7">
                                <div className="font-bold"> Long Url </div>
                                <div className="col-span-2 line-clamp-1 bg-white text-black px-2 p-0.5 rounded-md opacity-70">
                                    {data.longUrl}
                                </div>
                                <div className="font-bold"> Shorty Url</div>
                                <div className="col-span-2">
                                    <span className="flex justify-center items-center gap-2 ">
                                        <span className="line-clamp-1 bg-white text-black px-2 p-0.5 rounded-md opacity-70">
                                            {data.shortUrl}
                                        </span>
                                        <CustomClipboard data={data.shortUrl} />
                                    </span>
                                </div>
                            </div>
                            {showQR && (
                                <div className="bg-white p-2 rounded-md">
                                    <QRCode
                                        className="h-14 w-14"
                                        value={data.shortUrl}
                                    />
                                </div>
                            )}
                        </div>
                        <Button
                            onClick={() => setShowQR((show) => !show)}
                            type="button"
                            className="h-8 p-2 opacity-70 m-2"
                        >
                            <QrCode className="mr-2" />{' '}
                            {showQR ? 'Hide QR' : 'Show QR'}{' '}
                        </Button>
                    </>
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
                src={AbstractImage}
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

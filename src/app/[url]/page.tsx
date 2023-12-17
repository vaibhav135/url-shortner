'use client';

import RocketLaunch from '@/assets/rocket-launch';
import { useQuery } from '@/common/hooks';
import { notFound, redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

type UrlRedirectResponseData = {
    shortUrl: string;
    longUrl: string;
};

const UrlRedirectPage = ({ params }: { params: { url: string } }) => {
    // useState.
    const [longUrl, setLongUrl] = useState('');
    const [redirectSeconds, setRedirectSeconds] = useState(5);

    // Variables.
    const { url } = params;

    // Api.
    const { isError, error, isSuccess, data } =
        useQuery<UrlRedirectResponseData>(`api/redirect/${url}`, {
            method: 'GET',
        });

    // useEffect.
    useEffect(() => {
        if (longUrl) {
            if (redirectSeconds === 0) {
                redirect(longUrl);
            } else {
                setTimeout(() => {
                    setRedirectSeconds(
                        (redirectSeconds) => redirectSeconds - 1
                    );
                }, 1000);
            }
        }
    }, [longUrl, redirectSeconds]);

    useEffect(() => {
        if (isSuccess && data) {
            setLongUrl(data.longUrl);
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (isError && error && error.status === 404) {
            notFound();
        }
    }, [isError, error]);

    // Render.
    return (
        <>
            <RocketLaunch />
        </>
    );
};

export default UrlRedirectPage;

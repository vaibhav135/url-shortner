'use client';

import { useQuery } from '@/common/hooks';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ShortendUrlResponseData } from './types';
import { DataTable } from './data-table';
import { Skeleton } from '../ui/skeleton';

export const UrlDataTable = () => {
    const [shortUrlData, setShortendUrlData] = useState<
        ShortendUrlResponseData[]
    >([]);

    const { data: sessionData } = useSession();
    const { isSuccess, data } = useQuery<ShortendUrlResponseData[]>(
        `api/users/${sessionData.user['id']}/shortend-urls`,
        {
            method: 'GET',
        }
    );

    useEffect(() => {
        if (isSuccess && data) {
            setShortendUrlData(data);
        }
    }, [data, isSuccess]);

    if (shortUrlData.length > 0) {
        return <DataTable data={shortUrlData} />;
    }
    return <Skeleton className="w-[100px] h-[20px] rounded-full" />;
};

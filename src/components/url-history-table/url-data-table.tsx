'use client';

import { useQuery } from '@/common/hooks';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ShortendUrlResponseData } from './types';
import { DataTable } from './data-table';
import { Skeleton } from '../ui/skeleton';

export const UrlHistoryTable = () => {
    const [shortUrlData, setShortendUrlData] = useState<
        ShortendUrlResponseData[]
    >([]);

    const { data: sessionData } = useSession();
    const { isSuccess, data, refetch } = useQuery<ShortendUrlResponseData[]>(
        `api/users/${sessionData.user['id']}/url-history`,
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
        return <DataTable data={shortUrlData} refetchTableData={refetch} />;
    }
    return <Skeleton className="w-[100px] h-[20px] rounded-full" />;
};

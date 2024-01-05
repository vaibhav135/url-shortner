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

    // Table Skeleton Loader.
    return (
        <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-full">
            <div className="flex flex-col gap-14 items-center">
                <div className="w-5/6 flex flex-row justify-between">
                    <Skeleton className="w-[150px] h-[20px] rounded-full" />
                    <Skeleton className="w-[150px] h-[20px] rounded-full" />
                    <Skeleton className="w-[150px] h-[20px] rounded-full" />
                    <Skeleton className="w-[150px] h-[20px] rounded-full" />
                    <Skeleton className="w-[150px] h-[20px] rounded-full" />
                    <Skeleton className="w-[150px] h-[20px] rounded-full" />
                </div>
                <Skeleton className="w-5/6 h-[20px] rounded-full" />
                <Skeleton className="w-5/6 h-[20px] rounded-full" />
                <Skeleton className="w-5/6 h-[20px] rounded-full" />
                <Skeleton className="w-5/6 h-[20px] rounded-full" />
                <Skeleton className="w-5/6 h-[20px] rounded-full" />
                <Skeleton className="w-5/6 h-[20px] rounded-full" />
                <Skeleton className="w-5/6 h-[20px] rounded-full" />
                <Skeleton className="w-5/6 h-[20px] rounded-full" />
            </div>
        </div>
    );
};

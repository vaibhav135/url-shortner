'use client';

import { UrlHistoryTable } from '@/components/url-history-table';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const MyShortUrlsPage = () => {
    const { status } = useSession();
    const router = useRouter();

    if (status === 'unauthenticated') {
        router.push('/signin');
        return <> </>;
    }

    return <UrlHistoryTable />;
};

export default MyShortUrlsPage;

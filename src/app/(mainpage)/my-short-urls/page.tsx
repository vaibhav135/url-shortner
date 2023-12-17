'use client';

import { UrlDataTable } from '@/components/url-data-table';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const MyShortUrlsPage = () => {
    const { status } = useSession();
    const router = useRouter();

    if (status === 'unauthenticated') {
        router.push('/signin');
        return <> </>;
    }

    return <UrlDataTable />;
};

export default MyShortUrlsPage;

'use client';

import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { Toaster } from 'react-hot-toast';

type TClientSessionProvider = {
    children: React.ReactNode;
    session: Session;
};

const ClientSessionProvider = ({
    children,
    session,
}: TClientSessionProvider) => {
    return (
        <SessionProvider session={session}>
            {children} <Toaster position="bottom-right" />{' '}
            <Toaster position="bottom-right" />
        </SessionProvider>
    );
};

export default ClientSessionProvider;

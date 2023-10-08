'use client'

import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
import { Toaster } from '@/components/ui'

type TClientSessionProvider = {
    children: React.ReactNode
    session: Session
}

const ClientSessionProvider = ({
    children,
    session,
}: TClientSessionProvider) => {
    return (
        <SessionProvider session={session}>
            {children} <Toaster />
        </SessionProvider>
    )
}

export default ClientSessionProvider

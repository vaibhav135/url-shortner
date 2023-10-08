'use client'

import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'

type TClientSessionProvider = {
    children: React.ReactNode
    session: Session
}

const ClientSessionProvider = ({
    children,
    session,
}: TClientSessionProvider) => {
    return <SessionProvider session={session}>{children}</SessionProvider>
}

export default ClientSessionProvider

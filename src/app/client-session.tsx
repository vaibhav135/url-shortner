import { SessionProvider } from 'next-auth/react'

type TClientSessionProvider = {
    children: React.ReactNode
    session
}

const ClientSessionProvider = ({
    children,
    session,
}: TClientSessionProvider) => {
    return <SessionProvider session={session}>{children}</SessionProvider>
}

export default ClientSessionProvider

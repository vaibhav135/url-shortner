import '../styles/globals.css';
import { Session } from 'next-auth';
import getServerSession from '@/lib/getServerSession';
import ClientSessionProvider from '@/common/provider/client-session';

export const metadata = {
    title: 'Shorty URL',
    description: 'Shorten any url',
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
    const session: Session = await getServerSession();

    return (
        <html lang="en">
            <body className="w-screen h-screen">
                <ClientSessionProvider session={session}>
                    {children}
                </ClientSessionProvider>
            </body>
        </html>
    );
};

export default RootLayout;

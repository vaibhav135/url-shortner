import getServerSession from '@/lib/getServerSession';
import '../styles/globals.css';
import ClientSessionProvider from '@/common/provider/client-session';
import { Session } from 'next-auth';
import { ThemeProvider } from '@/common/provider';
import { NavigationBar } from '@/components/navigation-bar';

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
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <NavigationBar />
                        {children}
                    </ThemeProvider>
                </ClientSessionProvider>
            </body>
        </html>
    );
};

export default RootLayout;

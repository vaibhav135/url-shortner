import { ThemeProvider } from '@/common/provider';
import { NavigationBar } from '@/components/navigation-bar';
import ClientSessionProvider from '@/common/provider/client-session';
import { Session } from 'next-auth';
import getServerSession from '@/lib/getServerSession';

const MainPageLayout = async ({ children }: { children: React.ReactNode }) => {
    const session: Session = await getServerSession();

    return (
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
    );
};

export default MainPageLayout;

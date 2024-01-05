import { ThemeProvider } from '@/common/provider';
import { NavigationBar } from '@/components/navigation-bar';

const MainPageLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <NavigationBar />
            {children}
        </ThemeProvider>
    );
};

export default MainPageLayout;

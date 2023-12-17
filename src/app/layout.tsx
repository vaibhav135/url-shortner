import '../styles/globals.css';

export const metadata = {
    title: 'Shorty URL',
    description: 'Shorten any url',
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en">
            <body className="w-screen h-screen">{children}</body>
        </html>
    );
};

export default RootLayout;

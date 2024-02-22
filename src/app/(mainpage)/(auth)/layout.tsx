import { Auth } from '@/components/auth';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <section className="h-full fixed">
            <Auth> {children} </Auth>
        </section>
    );
};

export default AuthLayout;

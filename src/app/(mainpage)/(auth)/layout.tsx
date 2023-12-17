import { Auth } from '@/components/auth';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <section>
            <Auth> {children} </Auth>
        </section>
    );
};

export default AuthLayout;

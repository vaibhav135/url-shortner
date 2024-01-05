import { getServerSession as _getServerSession } from 'next-auth/next';
import { cookies, headers } from 'next/headers';
import { authOptionsWrapper } from '@/app/api/auth/[...nextauth]/route';
import { Session } from 'next-auth';

const getServerSession = (): Promise<Session> => {
    return _getServerSession(
        authOptionsWrapper(
            {
                headers: headers(),
                cookies: cookies(),
            } as any,
            { params: { nextauth: ['session'] } }
        )[2]
    );
};

export default getServerSession;

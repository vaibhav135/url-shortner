import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GithubProvider from 'next-auth/providers/github';
import NextAuth, { AuthOptions } from 'next-auth';
import { decode, encode } from 'next-auth/jwt';
import { Prisma } from '@prisma/client';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { loginSchema } from '@/common/validation/auth';
import prisma from '@/common/db';

interface Context {
    params: { nextauth: string[] };
}

export const authOptionsWrapper = (request: NextRequest, context: Context) => {
    const { params } = context;
    const isCredentialsCallback =
        params?.nextauth?.includes('callback') &&
        params.nextauth.includes('credentials') &&
        request.method === 'POST';

    return [
        request,
        context,
        {
            adapter: PrismaAdapter(prisma),
            providers: [
                GithubProvider({
                    clientId: process.env.GITHUB_ID!,
                    clientSecret: process.env.GITHUB_SECRET!,
                }),
                GoogleProvider({
                    clientId: process.env.GOOGLE_ID!,
                    clientSecret: process.env.GOOGLE_SECRET!,
                }),
                CredentialsProvider({
                    credentials: {
                        email: { label: 'email', type: 'text' },
                        password: { label: 'password', type: 'password' },
                    },
                    authorize: async (credentials) => {
                        try {
                            const result =
                                await loginSchema.safeParseAsync(credentials);

                            if (result.success === false) {
                                throw new Error(result.error.errors[0].message);
                            }

                            const { email, password } = result.data;

                            const user = await prisma.user.findUnique({
                                where: {
                                    email,
                                },
                                include: {
                                    accounts: true,
                                },
                            });

                            if (!user) {
                                throw new Error('User account does not exist');
                            }

                            if (user.accounts[0].provider !== 'credentials') {
                                throw new Error(
                                    `Please sign in with ${user.accounts[0].provider}`
                                );
                            }

                            const passwordsMatch = await bcrypt.compare(
                                password,
                                user?.password!
                            );

                            if (!passwordsMatch) {
                                throw new Error('Password is not correct');
                            }
                            return user as any;
                        } catch (error) {
                            if (
                                error instanceof
                                    Prisma.PrismaClientInitializationError ||
                                error instanceof
                                    Prisma.PrismaClientKnownRequestError
                            ) {
                                throw new Error(
                                    'System error. Please contact support'
                                );
                            }

                            throw error;
                        }
                    },
                }),
            ],
            callbacks: {
                async signIn({ user }) {
                    if (isCredentialsCallback) {
                        if (user) {
                            const sessionToken = randomUUID();
                            const sessionExpiry = new Date(
                                Date.now() + 60 * 60 * 24 * 30
                            );

                            await prisma.session.create({
                                data: {
                                    sessionToken,
                                    userId: user.id,
                                    expires: sessionExpiry,
                                },
                            });

                            cookies().set(
                                'next-auth.session-token',
                                sessionToken,
                                {
                                    expires: sessionExpiry,
                                }
                            );
                        }
                    }
                    return true;
                },
                async redirect({ baseUrl }) {
                    return baseUrl;
                },
                async session({ session, user }) {
                    // Send properties to the client, like an access_token from a provider.
                    session.user['id'] = user.id;
                    return session;
                },
            },
            secret: process.env.NEXTAUTH_SECRET,
            jwt: {
                maxAge: 60 * 60 * 24 * 30,
                encode: async (arg) => {
                    if (isCredentialsCallback) {
                        const cookie = cookies().get('next-auth.session-token');

                        if (cookie) return cookie.value;
                        return '';
                    }

                    return encode(arg);
                },
                decode: async (arg) => {
                    if (isCredentialsCallback) {
                        return null;
                    }
                    return decode(arg);
                },
            },
            debug: process.env.NODE_ENV === 'development',
            events: {
                async signOut({ session }) {
                    const { sessionToken = '' } = session as unknown as {
                        sessionToken?: string;
                    };

                    if (sessionToken) {
                        await prisma.session.deleteMany({
                            where: {
                                sessionToken,
                            },
                        });
                    }
                },
            },
            pages: {
                signIn: '/signin',
                signOut: '/',
                newUser: '/signup',
            },
        } as AuthOptions,
    ] as const;
};

async function handler(request: NextRequest, context: Context) {
    return NextAuth(...authOptionsWrapper(request, context));
}

export { handler as GET, handler as POST };

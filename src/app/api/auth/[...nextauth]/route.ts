import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GithubProvider from 'next-auth/providers/github';
import NextAuth, { AuthOptions } from 'next-auth';
import { decode, encode } from 'next-auth/jwt';
import { Prisma } from '@@/.prisma/client';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { loginSchema } from '@/common/validation/auth';
import prisma from '@/common/db';
import { ErrorMap, ErrorsSlug } from '@/common/errors';
import { isEmpty } from 'lodash';

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
                                const { error, message } =
                                    ErrorMap[ErrorsSlug.UserDoesNotExist];

                                throw new Error(
                                    JSON.stringify({
                                        error,
                                        message,
                                        status: 404,
                                    })
                                );
                            }

                            if (user.accounts[0].provider !== 'credentials') {
                                const { error, message } =
                                    ErrorMap[
                                        ErrorsSlug.CredentialProviderMismatch
                                    ];

                                throw new Error(
                                    JSON.stringify({
                                        error,
                                        message,
                                        status: 400,
                                    })
                                );
                            }

                            const passwordsMatch = await bcrypt.compare(
                                password,
                                user?.password!
                            );

                            if (!passwordsMatch) {
                                const { error, message } =
                                    ErrorMap[ErrorsSlug.IncorrectPassword];

                                throw new Error(
                                    JSON.stringify({
                                        error,
                                        message,
                                        status: 400,
                                    })
                                );
                            }
                            return user as any;
                        } catch (error) {
                            if (
                                error instanceof
                                    Prisma.PrismaClientInitializationError ||
                                error instanceof
                                    Prisma.PrismaClientKnownRequestError
                            ) {
                                const { error, message } =
                                    ErrorMap[ErrorsSlug.SystemError];

                                throw new Error(
                                    JSON.stringify({
                                        error,
                                        message,
                                        status: 500,
                                    })
                                );
                            }

                            throw error;
                        }
                    },
                }),
            ],
            callbacks: {
                async signIn({ user, account }) {
                    if (isCredentialsCallback) {
                        // When the user login in with credentials
                        if (user.id) {
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
                    } else {
                        // When the user login with oauth.
                        const userDetails = await prisma.user.findUnique({
                            relationLoadStrategy: 'join',
                            where: {
                                email: user.email,
                            },
                            include: {
                                accounts: {
                                    where: {
                                        provider: account.provider,
                                    },
                                },
                            },
                        });

                        if (isEmpty(userDetails.accounts)) {
                            try {
                                console.log(account);
                                await prisma.account.create({
                                    data: {
                                        userId: userDetails.id,
                                        ...account,
                                    },
                                });

                                // TODO: Try creating a different account for the
                                // same user since it's 1 -> n relationship
                            } catch (error) {
                                let message = '';
                                if (
                                    error instanceof
                                    Prisma.PrismaClientKnownRequestError
                                ) {
                                    if (error.code === 'P2002') {
                                        const { message: dbMessage } =
                                            ErrorMap[
                                                ErrorsSlug.UserAlreadyExist
                                            ];

                                        message = dbMessage;
                                    }
                                } else {
                                    message = error.message;
                                }
                                throw new Error(
                                    JSON.stringify({
                                        error,
                                        message,
                                        status: 404,
                                    })
                                );
                            }
                        }

                        console.log(userDetails);
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
                maxAge: 60 * 60 * 24 * 3,
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
            debug: true,
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
                error: '/signin',
            },
        } as AuthOptions,
    ] as const;
};

async function handler(request: NextRequest, context: Context) {
    return NextAuth(...authOptionsWrapper(request, context));
}

export { handler as GET, handler as POST };

import NextAuth, { AuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { decode, encode } from 'next-auth/jwt'
import bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { Prisma } from '@prisma/client'
import { loginSchema } from '@/common/validation/auth'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/common/db'

type Context = {
    params: { nextauth: string[] }
}

// DB session setup reference: https://github.com/nextauthjs/next-auth/discussions/4394#discussioncomment-5503602
const credentialProvider = CredentialsProvider({
    credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'Password', type: 'password' },
    },
    authorize: async (credentials) => {
        try {
            const result = await loginSchema.safeParseAsync(credentials)

            if (result.success === false) {
                throw new Error(result.error.errors[0].message)
            }

            const { email, password } = result.data

            const user = await prisma.user.findUnique({
                where: {
                    email,
                },
            })

            if (!user) {
                throw new Error('User account does not exist')
            }

            const passwordsMatch = await bcrypt.compare(
                password,
                user?.password!
            )

            if (!passwordsMatch) {
                throw new Error('Password is not correct')
            }

            return {
                id: user.id,
                email: user.email,
                image: user.image,
                name: user.name,
            }
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientInitializationError ||
                error instanceof Prisma.PrismaClientKnownRequestError
            ) {
                throw new Error('System error. Please contact support')
            }

            throw error
        }
    },
})

export const authOptionsWrapper = (
    request: NextRequest,
    context: Context
): [NextRequest, Context, AuthOptions] => {
    const { params } = context

    // This indicates that the callback for credentials is invoked. Meaning we are making a request for signin.
    const isCredentialsCallback =
        params?.nextauth?.includes('callback') &&
        params.nextauth.includes('credentials') &&
        request.method === 'POST'

    return [
        request,
        context,
        {
            adapter: PrismaAdapter(prisma),
            providers: [
                GithubProvider({
                    clientId: process.env.GITHUB_ID || '',
                    clientSecret: process.env.GITHUB_SECRET || '',
                }),
                GoogleProvider({
                    clientId: process.env.GOOGLE_CLIENT_ID || '',
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
                }),
                // @ts-ignore
                credentialProvider,
            ],
            callbacks: {
                async signIn({ user }) {
                    if (isCredentialsCallback) {
                        if (user) {
                            const sessionToken = randomUUID()
                            const sessionExpiry = new Date(
                                Date.now() + 60 * 60 * 24 * 30 * 1000
                            )

                            await prisma.session.create({
                                data: {
                                    sessionToken,
                                    userId: user.id,
                                    expires: sessionExpiry,
                                },
                            })

                            cookies().set(
                                'next-auth.session-token',
                                sessionToken,
                                {
                                    expires: sessionExpiry,
                                }
                            )
                        }
                    }
                    return true
                },
                async redirect({ baseUrl }) {
                    return baseUrl
                },
            },
            secret: process.env.NEXTAUTH_SECRET,
            jwt: {
                maxAge: 60 * 60 * 24 * 30,
                encode: async (arg) => {
                    if (isCredentialsCallback) {
                        const cookie = cookies().get('next-auth.session-token')

                        if (cookie) return cookie.value
                        return ''
                    }

                    return encode(arg)
                },
                decode: async (arg) => {
                    if (isCredentialsCallback) {
                        return null
                    }
                    return decode(arg)
                },
            },
            debug: process.env.NODE_ENV === 'development',
            events: {
                async signOut({ session }) {
                    const { sessionToken = '' } = session as unknown as {
                        sessionToken?: string
                    }

                    if (sessionToken) {
                        await prisma.session.deleteMany({
                            where: {
                                sessionToken,
                            },
                        })
                    }
                },
            },
            pages: {
                signIn: '/signin',
                signOut: '/',
                newUser: '/signup',
            },
        },
    ]
}

const handler = async (request: NextRequest, context: Context) => {
    console.log(context)
    return NextAuth(...authOptionsWrapper(request, context))
}

export { handler as GET, handler as POST }

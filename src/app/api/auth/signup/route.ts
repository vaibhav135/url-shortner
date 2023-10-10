import prisma from '@/common/db'
import { signUpSchema } from '@/common/validation/auth'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcrypt'

export const POST = async (request: Request) => {
    const { email, user, password } = await request.json()
    const result = signUpSchema.safeParse({
        email,
        user,
        password,
    })

    if (!result.success) {
        return Response.json('Internal Server Error', {
            status: 400,
        })
    }

    const hashedPassword: string = await bcrypt.hash(password, 10)
    let newUser: Prisma.UserCreateInput

    try {
        newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        })

        await prisma.account.create({
            data: {
                userId: newUser.id,
                type: 'credentials',
                provider: 'credentials',
                providerAccountId: newUser.id,
            },
        })
    } catch (error) {
        let message = ''
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                message = 'User already exists.'
            }
        } else {
            message = error.message
        }
        return Response.json(message, {
            status: 400,
        })
    }
    return Response.json('User Created Successfully.', { status: 202 })
}

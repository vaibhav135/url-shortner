import prisma from '@/common/db'
import { signUpSchema } from '@/common/validation/auth'
import bcrypt from 'bcrypt'

const POST = async (request: Request) => {
    const { email, user, password } = await request.json()
    const result = signUpSchema.safeParse({
        email,
        user,
        password,
    })

    if (!result.success) {
        return Response.json('User Created Successfully.', {
            status: 400,
        })
    }

    const hashedPassword: string = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
        data: {
            email,
            name: user,
            password: hashedPassword,
        },
    })

    prisma.account.create({
        data: {
            userId: newUser.id,
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: newUser.id,
        },
    })

    return Response.json('User Created Successfully.', { status: 202 })
}

export default POST

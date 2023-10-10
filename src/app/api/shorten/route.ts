import prisma from '@/common/db'
import { Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import z from 'zod'

const shortendUrlSchema = z.object({
    url: z.string().url(),
    userId: z.string().cuid(),
})

const urlShorterAlgorithm = (url: string): string => {
    const baseUrl = process.env.BASE_URL!
    const encodedString = btoa(url)
    const encodedStrLen = encodedString.length
    const uuid = randomUUID()

    const newEncodedString =
        encodedString[0] +
        uuid.slice(4, 6) +
        encodedString.slice(encodedStrLen - 1) +
        encodedString[encodedStrLen / 2]

    return `${baseUrl}/${newEncodedString}`
}

export const POST = async (request: Request) => {
    const { url, userId } = await request.json()
    const validatedData = shortendUrlSchema.safeParse({
        url,
        userId,
    })

    if (!validatedData.success) {
        return Response.json('Invalid payload', {
            status: 400,
        })
    }

    let result: Prisma.ShortendUrlUncheckedCreateInput

    try {
        const shortUrl = urlShorterAlgorithm(url)
        result = await prisma.shortendUrl.create({
            data: {
                userId: userId,
                shortUrl,
                longUrl: url,
            },
        })
    } catch (error) {
        let message = ''
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P202') {
                message = 'This url has already been shortend'
            }
        } else {
            message = error.message
        }
        return Response.json(message, {
            status: 400,
        })
    }

    return Response.json(
        { message: 'Url shortend Successfully', data: result },
        {
            status: 200,
        }
    )
}

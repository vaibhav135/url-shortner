import prisma from '@/common/db'
import { z } from 'zod'

const deletePayloadSchema = z.object({
    userId: z.string().cuid(),
    shortendUrlIds: z.string().array(),
})

export const POST = async (req: Request) => {
    const { shortendUrlIds, userId } = await req.json()

    const validatedData = deletePayloadSchema.safeParse({
        shortendUrlIds,
        userId,
    })

    if (!validatedData.success) {
        return Response.json('Invalid payload', {
            status: 400,
        })
    }

    try {
        const result = await prisma.shortendUrl.deleteMany({
            where: {
                userId,
                id: { in: shortendUrlIds },
            },
        })

        let message = ''
        if (result.count > 0) {
            message = 'Url bulk deleted succesfully'
        } else {
            message = 'No Url found!'
        }

        return Response.json(
            { message, data: result },
            {
                status: 200,
            }
        )
    } catch (error) {
        const message = error.message
        return Response.json(message, {
            status: 400,
        })
    }
}

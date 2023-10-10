import prisma from '@/common/db'

export const GET = async (_, context: { params }) => {
    const { id } = context.params
    try {
        const result = await prisma.shortendUrl.findMany({
            where: {
                userId: id,
            },
        })

        return Response.json(
            { message: 'Shortend url list fetched successfully', data: result },
            {
                status: 400,
            }
        )
    } catch (error) {
        const message = error.message
        return Response.json(message, {
            status: 400,
        })
    }
}

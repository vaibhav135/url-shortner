import prisma from '@/common/db';
import getServerSession from '@/lib/getServerSession';

export const GET = async (_, context: { params }) => {
    const { id } = context.params;
    const session = await getServerSession();

    if (!session) {
        return Response.json('User not logged in !!!', {
            status: 401,
        });
    }

    try {
        const result = await prisma.shortendUrl.findMany({
            where: {
                userId: id,
            },
        });

        return Response.json(
            { message: 'Shortend url list fetched successfully', data: result },
            {
                status: 200,
            }
        );
    } catch (error) {
        const message = error.message;
        return Response.json(message, {
            status: 400,
        });
    }
};

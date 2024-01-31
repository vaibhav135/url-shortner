import prisma from '@/common/db';

export const GET = async (_, context: { params }) => {
    const { url } = context.params;
    const shortUrl = `${process.env.BASE_URL}/${url}`;
    const result = await prisma.shortendUrl.findUnique({
        where: {
            shortUrl,
        },
    });

    if (!result) {
        return Response.json('Url not found', { status: 404 });
    }

    return Response.json(
        { message: 'URL found', data: result },
        { status: 200 }
    );
};

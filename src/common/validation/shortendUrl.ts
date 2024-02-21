import z from 'zod';

export const shortendUrlSchema = z.object({
    url: z.string().min(3),
    userId: z.string().cuid(),
});

export type ShortendUrlData = z.infer<typeof shortendUrlSchema>;

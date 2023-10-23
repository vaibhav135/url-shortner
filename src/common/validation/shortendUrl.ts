import z from 'zod';

export const shortendUrlSchema = z.object({
    url: z.string().endsWith('.com').url(),
    userId: z.string().cuid(),
});

export type ShortendUrlData = z.infer<typeof shortendUrlSchema>;

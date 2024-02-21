import * as z from 'zod';

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4),
});

export const signUpSchema = loginSchema;
export type TSignIn = z.infer<typeof loginSchema>;
export type TSignUp = z.infer<typeof signUpSchema>;

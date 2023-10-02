import * as z from 'zod'

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4).max(12),
})

export const signUpSchema = loginSchema.extend({
    username: z.string(),
})

export type TLogin = z.infer<typeof loginSchema>
export type TSignUp = z.infer<typeof signUpSchema>

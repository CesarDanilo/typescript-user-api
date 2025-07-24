import { z } from 'zod';

export default async function validateDataEntry(email: String, password: String) {

    const schema = z.object({
        email: z.string().email('E-mail não é valido'),
        password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
    })

    const result = await schema.safeParse({
        email: email,
        password: password
    })

    return result.success
}   
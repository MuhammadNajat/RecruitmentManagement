import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
//import { sql } from '@vercel/postgres';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import { Concert_One } from 'next/font/google';

async function getUser(email: string): Promise<User | undefined> {
    try {
        /*const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
        return user.rows[0];*/
        const user: User = {
            id: "1",
            name: "John Doe",
            email: "john.doe@example.com",
            password: "$2b$10$jThPhMhjsoUJ5CYutjgV8eQPH26hKbJht/0FsgjNvnqFGMQFc4dLa"
        };

        return user;
          
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                console.log("*** *** ***\n\n\nIn authorize()");
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    console.log(">>> parsedCredentials.success");
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;
                    console.log(">>> User found");
                    console.log(">>>email:", email, ", password:", password);
                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
    secret: process.env.AUTH_SECRET,
});
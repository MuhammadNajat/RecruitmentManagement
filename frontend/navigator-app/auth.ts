import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
//import { sql } from '@vercel/postgres';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import { Concert_One } from 'next/font/google';

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb://localhost:27017/";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}

async function getUser(email: string): Promise<User | undefined> {
    try {
        await connectDB().catch(console.dir);
        const database = client.db('RecruitmentManagement');
        console.log("$$$ database", database);

        const collection = database.collection('users');
        console.log("$$$ collection", collection);
        
        const users = await collection.find({ "email": "ahmad@example.com" }).toArray();
        console.log("### Documents by email:", users);

        return users[0];
          
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
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
'use server';

import { z } from 'zod';
//import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import email from 'next-auth/providers/email';
import { error } from 'console';
import { request, gql, GraphQLClient } from 'graphql-request';

export async function deleteProblemCategory(id: string) {
    const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
        headers: {
            //authorization: 'Apikey ' + process.env.AUTH_SECRET,
        },
    });

    const query = gql`
        mutation DeleteProblemCategory($id : ID!) {
            deleteProblemCategory(id : $id) {
                id
            }
        }
    `;
    const variables = {
        id: id
    };


    try {
        const results = await graphQLClient.request(query, variables);
        console.log(">>> >>> Delete Problem Category Results:");
        console.log(results);
    } catch (error) {
        console.error("Error deleting Problem Category:", error);
    }

    revalidatePath('/admin/problem-categories');

    redirect('/admin/problem-categories');
}
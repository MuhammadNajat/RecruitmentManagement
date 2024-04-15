'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { gql, GraphQLClient } from 'graphql-request';

export async function deleteUser(id: string) {
    const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
        headers: {
            //authorization: 'Apikey ' + process.env.AUTH_SECRET,
        },
    });

    const query = gql`
    mutation DeleteUser($id: ID!) {
        deleteUser(id: $id) {
          id
        }
      }
    `;
    const variables = {
        id: id
    };


    try {
        const results = await graphQLClient.request(query, variables);
        console.log(">>> >>> Delete Results:");
        console.log(results);
    } catch (error) {
        console.error("Error deleting data:", error);
    }

    revalidatePath('/admin/users');

    redirect('/admin/users');
}
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { gql, GraphQLClient } from 'graphql-request';

export async function deleteTag(id: string) {
    const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
        headers: {
            //authorization: 'Apikey ' + process.env.AUTH_SECRET,
        },
    });

    const query = gql`
    mutation DeleteTag($id: ID!) {
        deleteTag(id: $id) {
          id
        }
      }
    `;
    const variables = {
        id: id
    };


    try {
        const results = await graphQLClient.request(query, variables);
        console.log(">>> >>> Delete Tag Results:");
        console.log(results);
    } catch (error) {
        console.error("Error deleting Tag:", error);
    }

    revalidatePath('/admin/tags');

    redirect('/admin/tags');
}
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { gql, GraphQLClient } from 'graphql-request';

export async function deleteProblem(id: string) {
    const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
        headers: {
            //authorization: 'Apikey ' + process.env.AUTH_SECRET,
        },
    });

    const query = gql`
        mutation DeleteProblem($id : ID!) {
            deleteProblem(id : $id) {
                id
            }
        }
    `;
    const variables = {
        id: id
    };


    try {
        const results = await graphQLClient.request(query, variables);
        console.log(">>> >>> Delete Problem Results:");
        console.log(results);
    } catch (error) {
        console.error("Error deleting Problem:", error);
    }

    revalidatePath('/admin/problems');

    redirect('/admin/problems');
}
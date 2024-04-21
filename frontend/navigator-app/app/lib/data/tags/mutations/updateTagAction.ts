'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { gql, GraphQLClient } from 'graphql-request';
import { checkNameValidity } from '@/app/lib/helpers/tag-validator';

const FormSchema = z.object({
  id: z.string(),
  name: z.string()
});

const UpdateTag = FormSchema.omit({ /*id: true*/ });

export async function updateTag(prevState: string | undefined, formData: FormData,) {
  const { id, name } = UpdateTag.parse({
    id: formData.get('id'),
    name: formData.get('name')
  });


  const inputValidity = checkNameValidity(name);
  if (!inputValidity[0]) {
    return inputValidity[1].toString();
  }

  updateTagData(id, name);

  revalidatePath('/admin/tags');

  redirect('/admin/tags');
}

async function updateTagData(id: string, name: string) {
  const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
    headers: {
      //authorization: 'Apikey ' + process.env.AUTH_SECRET,
    },
  });

  const query = gql`
      mutation UpdateTag($id: ID!, $input: TagUpdateInput!) {
        updateTag(id: $id, input: $input) {
          id
          name
        }
      }
    `;

  const variables = {
    id: id,
    input: {
      name: name
    }
  };

  try {
    const results = await graphQLClient.request(query, variables);
    console.log("Mutation (Update Tag) Results:");
    console.log(results);
  } catch (error) {
    console.error("Error udating Tag:", error);
  }
}
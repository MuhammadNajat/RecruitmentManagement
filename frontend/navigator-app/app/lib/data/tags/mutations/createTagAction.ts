'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { gql, GraphQLClient } from 'graphql-request';
import { checkNameValidity } from '@/app/lib/helpers/tag-validator';
import { getTagByName } from '../queries/readTagAction';

const FormSchema = z.object({
  id: z.string(),
  name: z.string()
});

const CreateTag = FormSchema.omit({ id: true });

export async function createTag(prevState: string | undefined, formData: FormData,) {
  const { name } = CreateTag.parse({
    name: formData.get('name')
  });

  const inputValidity = checkNameValidity(name);
  if (!inputValidity[0]) {
    return inputValidity[1].toString();
  }

  const trimmedName = name.trim();

  const tagWithInputName = await getTagByName(trimmedName);
  console.log(">>> >>> >>> tagWithInputName", tagWithInputName);

  if(tagWithInputName != null) {
    const response = "A tag with the same name exists.";
    return response;
  }

  await insertData(trimmedName);

  revalidatePath('/admin/tags');

  redirect('/admin/tags');
}

async function insertData(name: string) {
  const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
    headers: {
      //authorization: 'Apikey ' + process.env.AUTH_SECRET,
    },
  });

  const query = gql`
      mutation CreateTag($input: TagCreateInput!) {
        createTag(input: $input) {
          id
          name
        }
      }
    `;
  const variables = {
    input: {
      name: name
    }
  };


  try {
    const results = await graphQLClient.request(query, variables);
    console.log("Mutation (Create Tag) Results:");
    console.log(results);
  } catch (error) {
    console.error("Error inserting Tag:", error);
  }
}
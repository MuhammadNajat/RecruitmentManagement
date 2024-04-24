'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { gql, GraphQLClient } from 'graphql-request';
import { checkNameValidity, checkNamesValidity } from '@/app/lib/helpers/problem-category-validator';
import { getProblemCategoryByName } from '../queries/readProblemCategoryAction';

const FormSchema = z.object({
    name: z.string(),
});

const CreateCategory = FormSchema.omit({});

export async function createCategory(prevState: string | undefined, formData: FormData,) {
    const { name } = CreateCategory.parse({
        name: formData.get('name'),
    });

    let categoryNameValidity = checkNameValidity(name);
    if (!categoryNameValidity[0]) {
        console.log("~~~ ~~~Insert valid category name");
        return categoryNameValidity[1].toString();
    }

    let trimmedName = name.trim();

    const categoryWithInputName = await getProblemCategoryByName(trimmedName);
    console.log(">>> >>> >>> categoryWithInputName", categoryWithInputName);

    if (categoryWithInputName != null) {
        const response = "A category with the same name exists.";
        return response;
    }

    insertCategory(trimmedName);

    revalidatePath('/admin/problem-categories');

    redirect('/admin/problem-categories');
}

async function insertCategory(name: string) {
    const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
        headers: {
            //authorization: 'Apikey ' + process.env.AUTH_SECRET,
        },
    });

    const query = gql`
        mutation CreateProblemCategory($input : ProblemCategoryCreateInput!) {
            createProblemCategory(input : $input) {
                name
            }
        }
    `;
    const variables = {
        input: {
            name: name,
        }
    };


    try {
        const results = await graphQLClient.request(query, variables);
        console.log("Mutation (Create categories) Results:");
        console.log(results);
    } catch (error) {
        console.error("Error inserting category:", error);
    }
}
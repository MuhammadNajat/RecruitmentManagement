'use server';

import { z } from 'zod';
//import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { checkNameValidity } from '@/app/lib/helpers/problem-category-validator';
import { gql, GraphQLClient } from 'graphql-request';
import { getProblemCategoryByName } from '../queries/readProblemCategoryAction';

const FormSchema = z.object({
    id: z.string(),
    name: z.string(),
});

const UpdateCategory = FormSchema.omit({/* */ });

export async function updateCategory(prevState: string | undefined, formData: FormData,) {
    const { id, name } = UpdateCategory.parse({
        id: formData.get('id'),
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

    try {
        await updateData(id, trimmedName);
    } catch (error) {
        console.error("!!! !!! Error updating category:", error);
    }

    revalidatePath('/admin/problem-categories');

    redirect('/admin/problem-categories');
}

async function updateData(id: string, name: string) {
    console.log("Enetered: updateProblemCategoryAction->updateData, id = ", id);
    const graphQLClient = new GraphQLClient('http://localhost:8080/query');

    const query = gql`
        mutation UpdateProblemCategory($id : ID!, $input : ProblemCategoryUpdateInput!) {
            updateProblemCategory(id : $id, input : $input) {
                name
            }
        }
    `;
    const variables = {
        id: id,
        input: {
            name: name,
        }
    };

    try {
        const results = await graphQLClient.request(query, variables);
        console.log("MMM MMM Mutation (Update categories) Results:");
        console.log(results);
    } catch (error) {
        console.error("EEE EEE Error updating category:", error);
    }
}
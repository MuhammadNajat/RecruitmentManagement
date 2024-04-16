'use server';

import { INVALID, z } from 'zod';
//import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { checkNameValidity, checkNamesValidity } from '@/app/lib/helpers/problem-category-validator';
import { request, gql, GraphQLClient } from 'graphql-request';

const FormSchema = z.object({
    id: z.string(),
    name: z.string(),
    subCategories: z.string(),
});

const UpdateCategory = FormSchema.omit({/* */ });

export async function updateCategory(prevState: string | undefined, formData: FormData,) {
    const { id, name, subCategories } = UpdateCategory.parse({
        id: formData.get('id'),
        name: formData.get('name'),
        subCategories: formData.get('subCategories'),
    });

    let categoryNameValidity = checkNameValidity(name);
    if (!categoryNameValidity[0]) {
        console.log("~~~ ~~~Insert valid category name");
        return categoryNameValidity[1].toString();
    }

    let trimmedName = name.trim();

    const chunks = subCategories.split(",");
    console.log("chunks: ", chunks);

    let validity = checkNamesValidity(chunks);
    if (!validity[0]) {
        console.log("~~~ ~~~Insert valid category name");
        return validity[1].toString();
    }


    let trimmedChunks: string[] = []
    chunks.forEach((item, index) => {
        trimmedChunks.push(item.trim());
    })

    try {
        await updateData(id, trimmedName, trimmedChunks);
    } catch (error) {
        console.error("!!! !!! Error updating category:", error);
    }

    revalidatePath('/admin/problem-categories');

    redirect('/admin/problem-categories');
}

async function updateData(id: string, name: string, subCategories: Array<string>) {
    console.log("Enetered: updateProblemCategoryAction->updateData, id = ", id);
    const graphQLClient = new GraphQLClient('http://localhost:8080/query');

    const query = gql`
        mutation UpdateProblemCategory($id : ID!, $input : ProblemCategoryUpdateInput!) {
            updateProblemCategory(id : $id, input : $input) {
                name
                subCategories
            }
        }
    `;
    const variables = {
        id: id,
        input: {
            name: name,
            subCategories: subCategories
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
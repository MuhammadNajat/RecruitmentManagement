'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { gql, GraphQLClient } from 'graphql-request';
import { checkNameValidity, checkNamesValidity } from '@/app/lib/helpers/problem-category-validator';

const FormSchema = z.object({
    name: z.string(),
    subCategories: z.string(),
});

const CreateCategory = FormSchema.omit({});

export async function createCategory(prevState: string | undefined, formData: FormData,) {
    const { name, subCategories } = CreateCategory.parse({
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

    insertCategory(trimmedName, trimmedChunks);

    revalidatePath('/admin/problem-categories');

    redirect('/admin/problem-categories');
}

async function insertCategory(name: string, subCategories: string[]) {
    const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
        headers: {
            //authorization: 'Apikey ' + process.env.AUTH_SECRET,
        },
    });

    const query = gql`
        mutation CreateProblemCategory($input : ProblemCategoryCreateInput!) {
            createProblemCategory(input : $input) {
            name
            subCategories
            }
        }
    `;
    const variables = {
        input: {
            name: name,
            subCategories: subCategories
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
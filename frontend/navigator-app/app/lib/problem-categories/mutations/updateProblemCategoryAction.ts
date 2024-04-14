'use server';

import { INVALID, z } from 'zod';
//import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import email from 'next-auth/providers/email';
import { error } from 'console';
import { request, gql, GraphQLClient } from 'graphql-request';

const FormSchema = z.object({
    id: z.string(),
    name: z.string(),
    subCategories: z.string(),
});

const UpdateCategory = FormSchema.omit({/* */});

export async function updateCategory(prevState: string | undefined, formData: FormData,) {
    const { id, name, subCategories } = UpdateCategory.parse({
        id: formData.get('id'),
        name: formData.get('name'),
        subCategories: formData.get('subCategories'),
    });

    console.log("*** category id: ", id);

    console.log("*** *** sub-categories" + subCategories);

    if (name.length < 2) {
        console.log("~~~ ~~~Insert valid category name");
        return "Insert valid category name";
    }

    const chunks = subCategories.split(",");
    console.log("chunks: ", chunks);

    let response = "";
    let invalidChars = "<>\'\"@%&{}[]()=";
    var invalidSubcategories: String[] = [];
    var regExp = /[a-zA-Z]/g;
    chunks.forEach((item, index) => {
        let containsInvalid = false;
        let containsAlphabet = false;
        for (let i = 0; i < item.length; i++) {
            containsInvalid = containsInvalid || (invalidChars.indexOf(item[i]) > -1);
            containsAlphabet = containsAlphabet || regExp.test(item[i]);
        }
        if (containsInvalid || !containsAlphabet) {
            invalidSubcategories.push(item);
        }
    })

    console.log("RESPONSE: " + response);

    let invalidSubcategoriesLength = invalidSubcategories.length;
    if (invalidSubcategoriesLength > 0) {
        for (let i = 0; i < invalidSubcategoriesLength; i++) {
            response = response + invalidSubcategories[i] + "\n";
        }
        response = "Invalid entries: " + response + (". \n NOTE: Please exclude these characters:" + invalidChars + ". Name must contain one alphabet at least.");
        console.log("&&& &&&" + response);
        return response;
    }

    let trimmedChunks: String[] = [];
    chunks.forEach((item, index) => {
        //trimmedChunks.push( item.trim() );
        chunks[index] = item.trim();
    })

    try {
        await updateData(id, name, chunks);
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
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
    name: z.string(),
    subCategories: z.string(),
});

const CreateCategory = FormSchema.omit({});

export async function createCategory(prevState: string | undefined, formData: FormData,) {
    const { name, subCategories } = CreateCategory.parse({
        name: formData.get('name'),
        subCategories: formData.get('subCategories'),
    });

    if (name.length < 2) {
        console.log("~~~ ~~~Insert valid category name");
        return "Insert valid category name";
    }

    const chunks = subCategories.split(",");
    console.log("chunks: ", chunks);

    let response = "";
    let invalidChars = "<>\'\"@%&{}[]()=";
    var invalidSubcategories: String[] = []
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


    insertCategory(name, chunks);

    revalidatePath('/admin/problems/categories');

    redirect('/admin/problems/categories');
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
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { gql, GraphQLClient } from 'graphql-request';
import { checkInputProblemValidity } from '@/app/lib/helpers/problem-validator';
import { useForm } from "react-hook-form";
import { ProblemCategory } from '@/app/lib/definitions';


const MAX_FILE_SIZE = 10490880; //1MB = 1024 KB = 1024 * 1024 Bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


const ProblemCreateFormSchema = z.object({
    statement: z.string(),
    image: z.any()
        /*.refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 1MB.`)
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )*/,
    difficulty: z.string(),
    categoryIDs: z.array(z.string()),
    tagIDs: z.array(z.string())
});

///const CreateCategory = ProblemCreateFormSchema.omit({});

export async function createProblem(prevState: string | undefined, data: FormData) {
    let { statement, image, difficulty, categoryIDs, tagIDs } = ProblemCreateFormSchema.parse({
        statement: data.get('statement'),
        image: data.get('image'),
        difficulty: data.get('difficulty'),
        categoryIDs: data.getAll('categories'),
        tagIDs: data.getAll('tags')
      });

    console.log("*** *** *** Data received on problem create form submission:");
    console.log(data);

    console.log("*** *** *** Destructured:");
    console.log("statement: ", statement, "image: ", image, "difficulty: ", difficulty, "categories:", categoryIDs, "tags: ", tagIDs);

    const validity = await checkInputProblemValidity({statement, image, difficulty, categoryIDs, tagIDs});

    if(!validity[0]) {
        return validity[1];
    }
    
    if(image.size == 0) {
        image = null;
    }

    insertProblem(statement, image, difficulty, categoryIDs, tagIDs);

    revalidatePath('/admin/problems');

    redirect('/admin/problems');

    return [true, ""];
}


async function insertProblem(statement: string, image: any, difficulty: string, categoryIDs: string[], tagIDs: string[]) {
    const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
        headers: {
            //authorization: 'Apikey ' + process.env.AUTH_SECRET,
        },
    });

    const query = gql`
        mutation CreateProblem($input : ProblemCreateInput!) {
            createProblem(input : $input) {
            _id
            statement
            image
            categoryIDs
            tagIDs
            status
            difficulty
            commentIDs
            authorUserID
            reviewerUserID
            approverAdminUserID
            createdAt
            updatedAt
            }
        }
    `;

    const variables = {
        input: {
            statement: statement,
            image: image,
            categoryIDs: categoryIDs,
            tagIDs: tagIDs,
            difficulty: difficulty,
            status: "SUBMITTED",
            authorUserID: "690",
            reviewerUserID: null,
            approverAdminUserID: null,
            commentIDs: null
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

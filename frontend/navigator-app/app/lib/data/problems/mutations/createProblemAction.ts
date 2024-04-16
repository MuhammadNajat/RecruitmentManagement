'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { gql, GraphQLClient } from 'graphql-request';
import { checkValidity } from '@/app/lib/helpers/problem-validator';

const MAX_FILE_SIZE = 10490880; //1MB = 1024 KB = 1024 * 1024 Bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


const FormSchema = z.object({
    statement: z.string(),
    image: z.any()
        .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 1MB.`)
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        ),
    difficulty: z.string(),
    tags: z.string()
});

const CreateCategory = FormSchema.omit({});

export async function createProblem(prevState: string | undefined, formData: FormData,) {
    const { statement, image, difficulty, tags } = CreateCategory.parse({
        statement: formData.get('statement'),
        image: formData.get('image'),
        difficulty: formData.get('difficulty'),
        tags: formData.get('tags')
    });

    let checkInputValidity = checkValidity(statement, image, difficulty, tags);
    if (!checkInputValidity[0]) {
        console.log("~~~ ~~~Insert valid category name");
        return checkInputValidity[1].toString();
    }

    insertProblem(statement, image, difficulty, tags);

    revalidatePath('/admin/problems');

    redirect('/admin/problems');
}

async function insertProblem(statement: string, image: any, difficulty: string, tags: string) {
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
            tags
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

    /**
     * statement : String!
  image : Upload
  tags : [String!]
  difficulty : Difficulty!
  status : Status!
  authorUserID : ID!
  reviewerUserID : ID
  approverAdminUserID : ID
  commentIDs : [ID!]
     */


    const variables = {
        input: {
            statement: statement,
            image: image,
            tags: tags,
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
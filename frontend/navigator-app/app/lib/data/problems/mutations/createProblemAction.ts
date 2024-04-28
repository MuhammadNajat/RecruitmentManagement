'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { gql, GraphQLClient } from 'graphql-request';
import { checkInputProblemValidity } from '@/app/lib/helpers/problem-validator';
import { ProblemCategory } from '@/app/lib/definitions';
import { v2 as cloudinary } from 'cloudinary';
import DatauriParser from 'datauri/parser';
import path from 'path';

const MAX_FILE_SIZE = 10490880; //1MB = 1024 KB = 1024 * 1024 Bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const ProblemCreateFormSchema = z.object({
    statement: z.string(),
    image: z.instanceof(File) //z.any()
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

    const validity = await checkInputProblemValidity({ statement, image, difficulty, categoryIDs, tagIDs });

    if (!validity[0]) {
        return validity[1];
    }

    if (image.size == 0) {
        insertProblem(statement, null, difficulty, categoryIDs, tagIDs);
        revalidatePath('/admin/problems');
        redirect('/admin/problems');
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    /*
    const parser = new DatauriParser();

    // create image
    const createImage = async (image) => {
        try {
            const base64Image = parser.format(path.extname(image.originalname).toString(), image.buffer);

            const options = {
                use_filename: true,
                unique_filename: false,
                overwrite: true,
            };

            //@ts-ignore
            const uploadedImageResponse = await cloudinary.uploader.upload(base64Image.content, options);
            return uploadedImageResponse;
        } catch (error) {
            console.error("!!! !!! !!! Error uploading image:", error);
        }
    }

    const imageCloudinaryPublicID = await createImage(image);
    */

    /****
    console.log("### ### Cloudinary Config:", cloudinary.config());

    //@ts-ignore
    const imageCloudinaryPublicID = uploadImage(base64CodedImage);
    ****/

    /*
    let imageURL = URL.createObjectURL(image);
    console.log("### ### image url data: ", imageURL);
    const imageCloudinaryPublicID = uploadImage(imageURL);
    */

    const imageCloudinaryPublicID = null;///uploadImage(imageURL);

    insertProblem(statement, imageCloudinaryPublicID, difficulty, categoryIDs, tagIDs);

    revalidatePath('/admin/problems');

    redirect('/admin/problems');

    return [true, ""];
}

async function uploadImage(imageURL: string) {

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
    };

    try {
        // Upload the image
        const result = await cloudinary.uploader.upload(imageURL, options);
        console.log("=> => => Image upload result: ", result);
        return result.public_id;
    } catch (error) {
        console.log("-> -> -> Image upload error: ");
        console.error(error);
    }
};

async function insertProblem(statement: string, imageCloudinaryPublicID: any, difficulty: string, categoryIDs: string[], tagIDs: string[]) {
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
            imageCloudinaryPublicID
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
            imageCloudinaryPublicID: imageCloudinaryPublicID,
            categoryIDs: categoryIDs,
            tagIDs: tagIDs,
            difficulty: difficulty,
            status: "SUBMITTED",
            authorUserID: "6626bb8a2bf891b04ca0ab74",
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

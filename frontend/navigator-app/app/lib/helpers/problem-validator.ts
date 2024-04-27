import { Tag, ProblemCategory } from "../definitions";
import { getProblemByID } from "../data/problems/queries/readProblemAction";
import { getTagByID } from "../data/tags/queries/readTagAction";
import { getProblemCategoryByID } from "../data/problem-categories/queries/readProblemCategoryAction";

const MAX_FILE_SIZE = 10490880; //1MB = 1024 KB = 1024 * 1024 Bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function checkInputProblemValidity({statement, image, difficulty, categoryIDs, tagIDs} : {statement:string, image:any, difficulty:string, categoryIDs: string [], tagIDs: string []}) {
    if(statement.length < 10 || statement.length > 700) {
        return [false, `Statement length should be in between 10-700 (inclusive)`];
    }
    
    if(image != null && image.size > 0) {
        if(image.size > MAX_FILE_SIZE) {
            return [false, `Max image size is 1MB.`];
        }
        if(!ACCEPTED_IMAGE_TYPES.includes(image.type)) {
            return [false, "Only .jpg, .jpeg, .png and .webp formats are supported"];
        }
        console.log("*** *** *** The selected image is valid :)");
    }
    else {
        console.log("*** *** *** No image Selected");
    }
    
    if(difficulty == null) {
        return [false, "Difficulty is required"];
    }

    for(let i=0; i<categoryIDs.length; i++) {
        let response = await getProblemCategoryByID(categoryIDs[i]);
        if(response == null) {
            return [false, "Invalid problem-category"];
        }
    }

    for(let i=0; i<tagIDs.length; i++) {
        let response = await getTagByID(tagIDs[i]);
        if(response == null) {
            return [false, "Invalid tag"];
        }
    }

    return [true, ""];
}
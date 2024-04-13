"use client";

import { createCategory } from "@/app/lib/createProblemCategoryAction";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from '@/app/ui/button';
import { unstable_noStore as noStore } from 'next/cache';
import DeleteProblemCategory from "./categoryDelete";


export default function CategoryName({ id, name }: { id: string, name: string }) {
    const categoryNameSpanID = `categoryNameSpanID_${id}`;
    const categoryNameEditFormID = `categoryNameEditFormID_${id}`;

    const handleEditButtonClick = () => {
        console.log("Enetered editButtonClicked");
        document.getElementById(categoryNameSpanID)?.classList.add("hidden");
        document.getElementById(categoryNameEditFormID)?.classList.remove("hidden");
    }

    const handleDeleteButtonClick = () => {
        console.log("Enetered deleteButtonClicked");
    }

    return (
        <span key={categoryNameSpanID}>
            <span id={categoryNameSpanID}>
                {name}
            </span>

            <form id={categoryNameEditFormID} className="hidden">
                <table>
                    <tr>
                        <td>
                            <label htmlFor="categoryNameInput">Name</label>
                            <input id="categoryNameInput" className="ml-2 p-1 border" type="text" defaultValue={name} />
                        </td>
                        <td>
                            <Button type="submit">Submit</Button>
                        </td>
                    </tr>
                </table>
            </form>

            <Link href={`/admin/users/${encodeURIComponent(id)}/edit`} className="text-indigo-600 hover:text-indigo-900">
                Edit
            </Link>

            <DeleteProblemCategory/>

            {/*
            <button
                type="button"
                className="inline-flex items-center p-1 ms-2 text-sm text-white bg-transparent rounded-sm hover:bg-gray-200 hover:text-black dark:hover:bg-gray-100 dark:hover:text-white ml-1"
                aria-label="Remove"
                onClick={handleEditButtonClick}>
                <svg className="h-4 w-4 text-yellow-500" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" stroke-linejoin="round">  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                <span className="sr-only">Edit</span>
            </button>

            <button
                type="button"
                className="inline-flex items-center p-1 ms-2 text-sm text-white bg-transparent rounded-sm hover:bg-gray-200 hover:text-black dark:hover:bg-gray-100 dark:hover:text-white ml-1"
                aria-label="Remove"
                onClick={handleDeleteButtonClick}>
                <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>

                <span className="sr-only">Delete</span>
            </button>
            */}
        </span>
    );
}
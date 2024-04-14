"use client";

import { createCategory } from "@/app/lib/problem-categories/mutations/createProblemCategoryAction";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from '@/app/ui/button';

export default function CategoryCreateForm() {

    const [errorMessage, dispatch] = useFormState(createCategory, undefined);

    const toggleCategoryCreateFormVisibility = () => {
        let classList = document.getElementById("categoryCreateForm")?.classList;
        if (classList == null) {
            return;
        }
        let plusSpan = document.getElementById("plusSpan");
        let minusSpan = document.getElementById("minusSpan");
        if (classList.contains("hidden")) {
            classList.remove("hidden");
            plusSpan?.classList?.add(plusSpan?.classList?.contains("hidden") ? "" : "hidden");
            minusSpan?.classList?.remove(plusSpan?.classList?.contains("hidden") ? "hidden" : "");
        }
        else {
            classList.add("hidden");
            plusSpan?.classList?.remove(plusSpan?.classList?.contains("hidden") ? "hidden" : "");
            minusSpan?.classList?.add(plusSpan?.classList?.contains("hidden") ? "" : "hidden");
        }
    }

    const addSubcategoryInputField = () => {
        let containerDiv = document.getElementById('subCategoryContainer');
        if (containerDiv == null) {
            return;
        }
        containerDiv.innerHTML +=
            `<div className='relative mt-2 rounded-md'>
            <div className='relative'>
                <input className='subCategories peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500' m-2 type='text' value=''
                placeholder="Enter Sub-category name" />
                <br />
            </div>
        </div>
        `;

    }

    const handleSubCategoryChange = () => {
        const text = document.getElementById("subCategories")?.innerText;
        console.log("text: ", text);
        const chunks = text?.split(",");
        if (chunks == undefined || chunks == null) {
            return;
        }

        console.log("chunks:", chunks);

        let outputDiv = document.getElementById('outputDiv');
        if (outputDiv == null) {
            return;
        }

        let outputText = "";
        for (let i = 0; i < chunks.length; i++) {
            outputText += ((i + 1).toString() + ". " + chunks[i]);
        }

        outputDiv.innerHTML = outputText;
    }

    return (
        <div>
            <button className="mt-5" onClick={toggleCategoryCreateFormVisibility}>
                <svg id="plusSpan" className="h-7 w-7 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>

                <svg id="minusSpan" className="hidden plus h-7 w-7 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>

            <form id="categoryCreateForm" action={dispatch} className="hidden w-2/3">
                <div className="rounded-md bg-gray-50 p-4 md:p-6">

                    {/* Category Name */}
                    <div className="mb-4">
                        <label htmlFor="name" className="mb-2 block text-sm font-medium">
                            Name
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter category name"
                                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                    required
                                    minLength={2}
                                    maxLength={50}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="subCategories" className="mb-2 block text-sm font-medium">
                            Sub-categories (seperated by comma)
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">
                                <input
                                    id="subCategories"
                                    name="subCategories"
                                    type="text"
                                    placeholder="Array, Tree, Sub-category 3, Sub-category 4"
                                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                    maxLength={220}
                                />
                            </div>
                        </div>
                    </div>


                    <div className="mt-6 flex justify-end gap-4">
                        {/*<Link
                            href="/admin/problems/categories"
                            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                        >
                            Cancel
                        </Link>*/}
                        <Button type="submit">Create</Button>
                    </div>

                    <div
                        className="p-2"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {errorMessage && (
                            <>
                                <p className="text-sm text-red-500">{errorMessage}</p>
                            </>
                        )}
                    </div>
                    <div className="flex h-8 items-end space-x-1">
                        {/* Add form errors here */}
                    </div>
                </div>
            </form>
        </div>
    );
}
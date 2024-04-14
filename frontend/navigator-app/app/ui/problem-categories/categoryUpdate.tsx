'use client';

import { ProblemCategory, User } from "@/app/lib/definitions";
import { updateUser } from "@/app/lib/users/mutations/updateUserAction";
import Link from "next/link";
import { Button } from '@/app/ui/button';
import { useFormState, useFormStatus } from 'react-dom';
import { updateCategory } from "@/app/lib/problem-categories/mutations/updateProblemCategoryAction";


export default function EditProblemCategoryForm({
    category
}: {
    category: ProblemCategory;
}) {
    console.log("### ### ### user inside EditProblemCategoryForm", category);
    //const updateUserWithId = updateUser.bind(null, user.employeeID);
    const [errorMessage, dispatch] = useFormState(updateCategory, undefined);

    let subCategories = "";
    let length = category.subCategories.length;
    for (let i = 0; i < length; i++) {
        subCategories += (category.subCategories[i]);
        subCategories += i == (length - 1) ? "" : ",";
    }

    return (
        <form id="categoryCreateForm" action={dispatch} className="w-2/3">
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Object ID*/}
                <div className="mb-4">
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                type="hidden"
                                id="id"
                                name="id"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                value={category._id}
                            />
                        </div>
                    </div>
                </div>

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
                                defaultValue={category.name}
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
                                defaultValue={subCategories}
                                maxLength={220}
                            />
                        </div>
                    </div>
                </div>


                <div className="mt-6 flex justify-end gap-4">
                    <Link
                        href="/admin/problem-categories"
                        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                        Cancel
                    </Link>
                    <Button type="submit">Update</Button>
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
    );
}
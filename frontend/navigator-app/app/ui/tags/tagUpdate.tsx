'use client';

import { Tag } from "@/app/lib/definitions";
import Link from "next/link";
import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';
import { updateTag } from "@/app/lib/data/tags/mutations/updateTagAction";


export default function EditTagForm({
    tag
}: {
    tag: Tag;
}) {
    console.log("### ### ### user inside EditTagForm", tag);
    const [errorMessage, dispatch] = useFormState(updateTag, undefined);

    return (
        <form id="tagCreateForm" action={dispatch} className="w-2/3">
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
                                value={tag._id}
                            />
                        </div>
                    </div>
                </div>

                {/* Tag Name */}
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
                                placeholder="Enter tag name"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                required
                                defaultValue={tag.name}
                                minLength={2}
                                maxLength={50}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <Link
                        href="/admin/tags"
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
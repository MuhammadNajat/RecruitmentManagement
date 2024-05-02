'use client';

import { useFormState } from 'react-dom';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Problem, Tag, ProblemCategory } from '@/app/lib/definitions';
import { createProblem } from '@/app/lib/data/problems/mutations/createProblemAction';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

export default function ReactHookForm({ tags, categories }: { tags: Tag[], categories: ProblemCategory[] }) {
    const [errorMessage, dispatch] = useFormState(createProblem, undefined);

    return (
        <form action={dispatch}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Statement */}
                <div className="mb-4">
                    <label htmlFor="employeeID" className="mb-2 block  font-medium">
                        Statement
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <textarea
                                id="statement"
                                name="statement"
                                placeholder="Enter statement"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10  outline-2 placeholder:text-gray-500"
                                required
                                minLength={1}
                                maxLength={700}
                            />
                        </div>
                    </div>
                </div>

                {/* Image */}
                <div className="mb-4">

                    <label htmlFor="image" className="mb-2 block  font-medium">
                        Image
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="image"
                                name="image"
                                type="file"
                                placeholder="Upload relevant image"
                                /*onChange={handleFileChange}*/
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10  outline-2 placeholder:text-gray-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Categories*/}
                <div className="mb-4">
                    <label htmlFor="tagsContent" className="mb-2 block  font-medium">
                        Categories
                    </label>
                    <div id="tagsContent">
                        {categories.map((category) => (
                            <span key={category._id}>
                                <input
                                    name="categories"
                                    id={category._id}
                                    type="checkbox"
                                    value={category._id}
                                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                />

                                <label htmlFor={category._id} key={category._id} className='mr-5 ms-2 '>{category.name}</label>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Tags*/}
                <div className="mb-4">
                    <label htmlFor="tagsContent" className="mb-2 block  font-medium">
                        Tags
                    </label>
                    <div id="tagsContent">
                        {tags.map((tag) => (
                            <span key={tag._id}>
                                <input
                                    name="tags"
                                    id={tag._id}
                                    type="checkbox"
                                    value={tag._id}
                                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                />

                                <label htmlFor={tag._id} key={tag._id} className='mr-5 ms-2'>{tag.name}</label>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Difficulty*/}
                <fieldset>
                    <legend className="mb-2 block  font-medium">
                        Difficulty
                    </legend>
                    <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                        <div className="flex gap-4">
                            <div className="flex items-center">
                                <input
                                    id="easy"
                                    name="difficulty"
                                    type="radio"
                                    value="EASY"
                                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-white focus:ring-2"
                                />
                                <label
                                    htmlFor="easy"
                                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-600 px-3 py-1.5  font-medium text-white"
                                >
                                    Easy
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="medium"
                                    name="difficulty"
                                    type="radio"
                                    value="MEDIUM"
                                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-white focus:ring-2"
                                />
                                <label
                                    htmlFor="medium"
                                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-orange-600 px-3 py-1.5  font-medium text-white"
                                >
                                    Medium
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="hard"
                                    name="difficulty"
                                    type="radio"
                                    value="HARD"
                                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-white focus:ring-2"
                                    required
                                />
                                <label
                                    htmlFor="hard"
                                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5  font-medium text-white"
                                >
                                    HARD
                                </label>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>

            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/admin/problems"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4  font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit">Create</Button>
            </div>

            <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
            >
                {errorMessage && (
                    <>
                        <p className=" text-red-500">{errorMessage}</p>
                    </>
                )}
            </div>
            <div className="flex h-8 items-end space-x-1">
                {/* Add form errors here */}
            </div>
        </form>
    );
}
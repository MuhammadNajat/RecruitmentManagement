'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';
import { createProblem } from '@/app/lib/data/problems/mutations/createProblemAction';
import { getProblemCategories } from '@/app/lib/data/problem-categories/queries/readProblemCategoryAction';
import { ProblemCategory } from '@/app/lib/definitions';


export default async function Form() {
  /*let temp: unknown = await getProblemCategories();
  const data = temp as ProblemCategory[];
  console.log(">>> >>> [In problems/create] categoryData:", data);
  //@ts-ignore
  const categories = data.getProblemCategories;
  console.log(">>> >>> fteched categories: ", categories);*/

  const [errorMessage, dispatch] = useFormState(createProblem, undefined);


  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Statement */}
        <div className="mb-4">
          <label htmlFor="employeeID" className="mb-2 block text-sm font-medium">
            Statement
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <textarea
                id="statement"
                name="statement"
                placeholder="Enter statement"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                minLength={1}
                maxLength={500}
              />
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="mb-4">

          <label htmlFor="image" className="mb-2 block text-sm font-medium">
            Image
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="image"
                name="image"
                type="file"
                placeholder="Upload relevant image"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Tags*/}
        <div className="mb-4">
          <label htmlFor="tags" className="mb-2 block text-sm font-medium">
            Tags
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="tags"
                name="tags"
                type="text"
                placeholder="Enter employee's official email address"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                pattern="/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/"
                minLength={0}
                maxLength={256}
              />
            </div>
          </div>
        </div>

        {/* Difficulty*/}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
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
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-600 px-3 py-1.5 text-xs font-medium text-white"
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
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-orange-600 px-3 py-1.5 text-xs font-medium text-white"
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
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white"
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
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
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
            <p className="text-sm text-red-500">{errorMessage}</p>
          </>
        )}
      </div>
      <div className="flex h-8 items-end space-x-1">
        {/* Add form errors here */}
      </div>
    </form>
  );
}
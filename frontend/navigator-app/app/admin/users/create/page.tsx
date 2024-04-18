'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';
import { createUser } from '@/app/lib/data/users/mutations/createUserAction';
import { generatePassword } from '@/app/lib/helpers/randomPasswordGenerator';


export default function Form() {
  

  const password = generatePassword();

  const [errorMessage, dispatch] = useFormState(createUser, undefined);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Employee ID */}
        <div className="mb-4">
          <label htmlFor="employeeID" className="mb-2 block text-sm font-medium">
            Employee ID
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="employeeID"
                name="employeeID"
                type="text"
                placeholder="Enter employee ID in the company"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                minLength={1}
                maxLength={10}
              />
            </div>
          </div>
        </div>

        {/* Employee Name */}
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
                placeholder="Enter employee name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                minLength={3}
                maxLength={50}
              />
            </div>
          </div>
        </div>

        {/* Email*/}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="text"
                placeholder="Enter employee's official email address"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                pattern="/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/"
                required
                minLength={5}
                maxLength={256}
              />
            </div>
          </div>
        </div>

        {/* Password */}

        {/* 
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password (randomly generated one is provided)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="password"
                name="password"
                type="text"
                placeholder="Enter an initial password"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                defaultValue={password}
                minLength={6}
                maxLength={15}
              />
            </div>
          </div>
        </div>
        */}

        {/* Role*/}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            User-type
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="problemSetter"
                  name="role"
                  type="radio"
                  value="PROBLEMSETTER"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="problemSetter"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-200 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Problem Setter
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="reviewer"
                  name="role"
                  type="radio"
                  value="REVIEWER"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="reviewer"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-400 px-3 py-1.5 text-xs font-medium text-gray-800"
                >
                  Reviewer
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="admin"
                  name="role"
                  type="radio"
                  value="ADMIN"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  required
                />
                <label
                  htmlFor="admin"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-600 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Admin
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/admin/users"
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
import {readUsers} from "@/app/lib/graphQLServiceConsumer"
import Image from 'next/image'
import { lusitana } from '@/app/ui/fonts';
import { User } from "@/app/lib/definitions";
import clsx from 'clsx';
import Link from 'next/link'
import DeleteUserInput from "@/app/ui/users/delete-command";

export default async function Users() {
  let temp: unknown = await readUsers();
  const userData = temp as User[];

  const users = userData.getUsers;
  console.log("^^^ ^^^ fteched users: ", userData);

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Users
      </h2>
      <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200v">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Employee ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Admin-assigned Password
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Changed Admin-assigned Password?
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Created at
                  </th>
                  {/*
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Updated at
                  </th>
                  */}
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.employeeID}>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {user.employeeID}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {user.name}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className="px-2 inline-flex text-xs leading-5
                      font-semibold rounded-full bg-green-100 text-green-800"
                      >
                        {user.email}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.role}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.adminAssignedPassword}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.changedAdminAssignedPassword? "Yes" : "No"}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt.slice(0, 19)}
                    </td>
                    {/*
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.updatedAt.slice(0, 19)}
                    </td>
                    */}
                    <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                      
                      <Link href={`/admin/users/${encodeURIComponent(user._id)}/edit`} className="text-indigo-600 hover:text-indigo-900">
                        Edit
                      </Link>

                      {/*
                      <Link
                        href={{
                          pathname: `/admin/users/${encodeURIComponent(user.employeeID)}/edit`,
                          query: user // the data
                        }}
                      >
                        Edit
                      </Link>
                      */}
                      
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {/*
                      <a href="#" className="text-indigo-600 hover:text-red-900">
                        Delete
                      </a>
                      */}
                      <DeleteUserInput id={user._id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    </div>
  );
}
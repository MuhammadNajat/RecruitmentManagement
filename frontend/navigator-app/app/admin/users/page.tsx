import { readUsers } from "@/app/lib/data/users/queries/readUserAction"
import { lusitana } from '@/app/ui/fonts';
import { User } from "@/app/lib/definitions";
import Link from 'next/link'
import DeleteComponent from "@/app/ui/users/delete-user";

export default async function Users() {
  let temp: unknown = await readUsers();
  const userData = temp as User[];
  console.log("&&& &&& userData", userData);
  //@ts-ignore
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
                      Created at
                    </th>
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
                    <tr key={user._id}>
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
                        {user.createdAt.slice(0, 19)}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">

                        <Link href={`/admin/users/${encodeURIComponent(user._id)}/edit`} className="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </Link>

                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">


                        <DeleteComponent key={user._id} id={user._id} />

                        {/*
                      <Link href={`/admin/users/${encodeURIComponent(user._id)}/delete`} className="text-indigo-600 hover:text-indigo-900">
                        Delete
                      </Link>
                      */}
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